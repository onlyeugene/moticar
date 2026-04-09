import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const token = useAuthStore((state) => state.token);

  // Derived from the base URL of the API.
  // We need only the origin (protocol + host + port) to avoid namespace mismatches.
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "https://api.moticar.com/v1";
  
  let socketUrl = "https://api.moticar.com";
  try {
    socketUrl = new URL(apiUrl).origin;
  } catch (e) {
    // Fallback if URL parsing fails
    socketUrl = apiUrl.split("/api")[0].split("/v")[0];
  }

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Connect to /obd namespace for live metrics
    const socketInstance = io(`${socketUrl}/obd`, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 5000,
    });

    socketInstance.on("connect", () => {
      console.log(`🔌 Connected to [obd] namespace: ${socketInstance.id}`);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Disconnected from [obd] namespace.");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err: Error) => {
      console.error("Socket error:", err.message);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
