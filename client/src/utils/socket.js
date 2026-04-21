import { io } from "socket.io-client";

// Strip /api suffix — Socket.IO connects to root, not /api
const RAW_URL = import.meta.env.VITE_API_URL || "https://campuscart-436h.onrender.com";
const BASE_URL = RAW_URL.replace(/\/api\/?$/, "");

let socketInstance = null;

export function getSocket() {
  const token = localStorage.getItem("token");

  // Reuse existing healthy connection with same token
  if (socketInstance?.connected && socketInstance._authToken === token) {
    return socketInstance;
  }

  // Destroy stale socket before creating a new one
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
  }

  socketInstance = io(BASE_URL, {
    // ✅ CRITICAL: Start with polling on Render (proxy doesn't support raw WS upgrade)
    // Socket.IO will automatically upgrade to WebSocket after polling succeeds
    transports: ["polling", "websocket"],
    auth: { token },
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 8000,
    timeout: 30000,   // 30s — enough for Render free tier cold start
    forceNew: true,
  });

  socketInstance._authToken = token;

  socketInstance.on("connect", () => {
    console.log("[Socket] Connected:", socketInstance.id);
  });

  socketInstance.on("connect_error", (err) => {
    console.error("[Socket] Connection error:", err.message);
  });

  socketInstance.on("disconnect", (reason) => {
    console.warn("[Socket] Disconnected:", reason);
  });

  return socketInstance;
}

export function destroySocket() {
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
  }
}