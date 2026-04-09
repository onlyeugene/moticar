import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService, Notification } from "@/services/api/notificationService";

import { useEffect } from "react";
import { useSocket } from "@/providers/SocketProvider";

export const useNotifications = (type?: string) => {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("notification:new", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    return () => {
      socket.off("notification:new");
    };
  }, [socket, isConnected, queryClient]);

  return useQuery({
    queryKey: ["notifications", type],
    queryFn: () => notificationService.getNotifications(type),
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
  });
};

export const useNotificationActions = () => {
  const queryClient = useQueryClient();

  const markAsRead = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: (type?: string) => notificationService.markAllAsRead(type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    markAsRead,
    markAllAsRead,
  };
};
