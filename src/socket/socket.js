import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentDocumentId = null;
    this.currentUser = null;
    this.listeners = new Map();
    this.broadcastChannel = null;
    this.activeUsersMap = new Map();
    this.statusListeners = new Set();
  }

  connect(token, user) {
    if (user) {
      this.currentUser = user;
    }

    if (SOCKET_URL && !this.socket) {
      try {
        this.socket = io(SOCKET_URL, {
          auth: { token },
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
          this.notifyStatus(true);
        });

        this.socket.on('disconnect', () => {
          this.notifyStatus(false);
        });

        this.socket.on('document-change', (data) => {
          this.emitLocal('document-change', data);
        });

        this.socket.on('presence-update', (users) => {
          this.emitLocal('presence-update', users);
        });
      } catch (e) {
        console.warn('[SocketService] WebSocket init fallback:', e);
      }
    }

    // Always enable real-time collaboration mode
    this.notifyStatus(true);
    return this.socket;
  }

  disconnect() {
    if (this.currentDocumentId) {
      this.leaveDocument(this.currentDocumentId);
    }
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.notifyStatus(false);
  }

  joinDocument(documentId, user) {
    this.currentDocumentId = documentId;
    if (user) {
      this.currentUser = user;
    }

    if (this.socket && this.socket.connected) {
      this.socket.emit('join-document', { documentId, user: this.currentUser });
    }

    // Setup BroadcastChannel for real-time document room sync across tabs & windows
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      if (this.broadcastChannel) {
        this.broadcastChannel.close();
      }
      this.broadcastChannel = new BroadcastChannel(`synkdocs_room_${documentId}`);
      this.broadcastChannel.onmessage = (event) => {
        const { type, payload, senderId } = event.data || {};
        if (senderId === this.currentUser?.id) return; // Ignore own broadcast

        if (type === 'DOCUMENT_CHANGE') {
          this.emitLocal('document-change', payload);
        } else if (type === 'USER_JOINED') {
          if (payload?.user) {
            this.activeUsersMap.set(payload.user.id, payload.user);
            this.broadcastMessage('PRESENCE_ACK', { user: this.currentUser });
            this.emitLocal('presence-update', Array.from(this.activeUsersMap.values()));
          }
        } else if (type === 'PRESENCE_ACK') {
          if (payload?.user) {
            this.activeUsersMap.set(payload.user.id, payload.user);
            this.emitLocal('presence-update', Array.from(this.activeUsersMap.values()));
          }
        } else if (type === 'USER_LEFT') {
          if (payload?.userId) {
            this.activeUsersMap.delete(payload.userId);
            this.emitLocal('presence-update', Array.from(this.activeUsersMap.values()));
          }
        }
      };

      // Register self in active room users
      if (this.currentUser) {
        this.activeUsersMap.set(this.currentUser.id, this.currentUser);
        this.broadcastMessage('USER_JOINED', { user: this.currentUser });
        this.emitLocal('presence-update', Array.from(this.activeUsersMap.values()));
      }
    }
  }

  leaveDocument(documentId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('leave-document', { documentId });
    }

    if (this.broadcastChannel && this.currentUser) {
      this.broadcastMessage('USER_LEFT', { userId: this.currentUser.id });
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }

    this.activeUsersMap.clear();
    this.currentDocumentId = null;
  }

  emitDocumentChange(documentId, content) {
    const payload = { documentId, content, senderId: this.currentUser?.id };

    if (this.socket && this.socket.connected) {
      this.socket.emit('send-changes', payload);
    }

    if (this.broadcastChannel) {
      this.broadcastMessage('DOCUMENT_CHANGE', payload);
    }
  }

  broadcastMessage(type, payload) {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type,
        payload,
        senderId: this.currentUser?.id,
      });
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emitLocal(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((cb) => cb(data));
    }
  }

  onStatusChange(callback) {
    this.statusListeners.add(callback);
    callback(this.isConnected);
    return () => this.statusListeners.delete(callback);
  }

  notifyStatus(status) {
    this.isConnected = status;
    this.statusListeners.forEach((cb) => cb(status));
  }
}

export const socketService = new SocketService();
