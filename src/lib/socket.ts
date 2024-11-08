'use client';
import { io } from 'socket.io-client';

const SOCKET_API =
    process.env.NODE_ENV == 'production'
        ? 'https://handbook-server.onrender.com'
        : 'http://localhost:5000';

export const socket = io(SOCKET_API, {
    autoConnect: false,
    reconnection: false,
});
