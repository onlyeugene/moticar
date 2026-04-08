import { useEffect } from "react";
import { useSocket } from "@/providers/SocketProvider";
import { useAppStore } from "@/store/useAppStore";

/**
 * Global hook to listen for real-time OBD data and sync to the store.
 */
export function useObdLiveListener() {
  const { socket, isConnected } = useSocket();
  const selectedCarId = useAppStore((state) => state.selectedCarId);
  const setObdData = useAppStore((state) => state.setObdData);

  useEffect(() => {
    if (!isConnected || !socket || !selectedCarId) return;

    console.log(`📡 Subscribing to Live OBD Data for Car: ${selectedCarId}`);
    socket.emit("subscribe_car", { carId: selectedCarId });

    // 1. Connection Status
    socket.on("obd:device_online", () => {
      setObdData(selectedCarId, { status: "online", lastSeen: new Date().toISOString() });
    });

    socket.on("obd:device_offline", () => {
      setObdData(selectedCarId, { status: "offline" });
    });

    // 2. Metrics
    socket.on("obd:fuel_update", (data: { level: number }) => {
      setObdData(selectedCarId, { fuelLevel: data.level });
    });

    socket.on("obd:battery_update", (data: { voltage: number }) => {
      setObdData(selectedCarId, { voltage: data.voltage.toFixed(1) });
    });

    // 3. Activity / Trips
    socket.on("obd:location_update", (data: { speed: number }) => {
      setObdData(selectedCarId, { 
        status: data.speed > 0 ? "moving" : "online",
        lastSeen: new Date().toISOString() 
      });
    });

    socket.on("obd:trip_status", (data: { status: "moving" | "paused" }) => {
        setObdData(selectedCarId, { status: data.status === "moving" ? "moving" : "online" });
    });

    return () => {
      socket.off("obd:device_online");
      socket.off("obd:device_offline");
      socket.off("obd:fuel_update");
      socket.off("obd:battery_update");
      socket.off("obd:location_update");
      socket.off("obd:trip_status");
    };
  }, [isConnected, socket, selectedCarId]);
}
