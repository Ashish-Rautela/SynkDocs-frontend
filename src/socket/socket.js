import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://ws.synkdocs.example.com';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentDocumentId = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket && this.isConnected) return this.socket;

    // Standard Socket.io initialization with placeholder options
    this.socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // In standalone mock mode, simulate socket connections smoothly
    this.isConnected = true;

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('[SocketService] Connected to real-time sync server');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('[SocketService] Disconnected from server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      if (this.currentDocumentId) {
        this.leaveDocument(this.currentDocumentId);
      }
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinDocument(documentId, user) {
    this.currentDocumentId = documentId;
    if (this.socket && this.socket.connected) {
      this.socket.emit('join-document', { documentId, user });
    }
    console.log(`[SocketService] Joined document session room: ${documentId}`);
  }

  leaveDocument(documentId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('leave-document', { documentId });
    }
    this.currentDocumentId = null;
    console.log(`[SocketService] Left document session room: ${documentId}`);
  }

  emitDocumentChange(documentId, contentDelta) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('send-changes', { documentId, delta: contentDelta });
    }
  }

  emitCursorPosition(documentId, cursorData) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('cursor-move', { documentId, cursorData });
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
}

export const socketService = new SocketService();
