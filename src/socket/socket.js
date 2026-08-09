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
    this.storageListener = null;
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

        this.socket.on('comment-added', (data) => {
          this.emitLocal('comment-added', data?.comment || data);
        });

        this.socket.on('comment-resolved', (data) => {
          this.emitLocal('comment-resolved', data?.commentId || data);
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

    // Setup BroadcastChannel for instant real-time document room sync across tabs & windows
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
        } else if (type === 'COMMENT_ADDED') {
          this.emitLocal('comment-added', payload?.comment);
        } else if (type === 'COMMENT_RESOLVED') {
          this.emitLocal('comment-resolved', payload?.commentId);
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

    // LocalStorage storage listener for instant cross-tab storage sync
    if (typeof window !== 'undefined') {
      if (this.storageListener) {
        window.removeEventListener('storage', this.storageListener);
      }
      this.storageListener = (e) => {
        if (e.key === `synkdocs_sync_${documentId}` && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (parsed.senderId !== this.currentUser?.id) {
              this.emitLocal('document-change', parsed);
            }
          } catch (err) {}
        }
        if (e.key === `synkdocs_comment_add_${documentId}` && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            this.emitLocal('comment-added', parsed.comment);
          } catch (err) {}
        }
        if (e.key === `synkdocs_comment_resolve_${documentId}` && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            this.emitLocal('comment-resolved', parsed.commentId);
          } catch (err) {}
        }
      };
      window.addEventListener('storage', this.storageListener);
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

    if (typeof window !== 'undefined' && this.storageListener) {
      window.removeEventListener('storage', this.storageListener);
      this.storageListener = null;
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

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          `synkdocs_sync_${documentId}`,
          JSON.stringify({ documentId, content, senderId: this.currentUser?.id, ts: Date.now() })
        );
      } catch (e) {}
    }
  }

  emitCommentAdded(documentId, comment) {
    const payload = { documentId, comment, senderId: this.currentUser?.id };
    if (this.socket && this.socket.connected) {
      this.socket.emit('comment-added', payload);
    }
    if (this.broadcastChannel) {
      this.broadcastMessage('COMMENT_ADDED', payload);
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`synkdocs_comment_add_${documentId}`, JSON.stringify({ comment, ts: Date.now() }));
      } catch (e) {}
    }
  }

  emitCommentResolved(documentId, commentId) {
    const payload = { documentId, commentId, senderId: this.currentUser?.id };
    if (this.socket && this.socket.connected) {
      this.socket.emit('comment-resolved', payload);
    }
    if (this.broadcastChannel) {
      this.broadcastMessage('COMMENT_RESOLVED', payload);
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`synkdocs_comment_resolve_${documentId}`, JSON.stringify({ commentId, ts: Date.now() }));
      } catch (e) {}
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
