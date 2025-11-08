import { io } from 'socket.io-client';

// Use your actual Render backend URL
const SOCKET_URL = import.meta.env.PROD 
  ? 'https://carreredge.onrender.com/'  // ← Replace with your actual Render URL
  : 'http://localhost:5001';

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  query: {
    userId: "user-id-here" // This should be dynamic from your auth store
  }
});