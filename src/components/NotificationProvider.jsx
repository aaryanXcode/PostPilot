import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const userId = "1"; // later from AuthContext

  // Load from sessionStorage on mount
  useEffect(() => {
    const savedNotifications = JSON.parse(sessionStorage.getItem("notifications") || "[]");
    const savedCount = parseInt(sessionStorage.getItem("unreadCount") || "0");
    setNotifications(savedNotifications);
    setUnreadCount(savedCount);
  }, []);

  // SSE listener
  useEffect(() => {
    const eventSource = new EventSource(
      `http://localhost:8080/api/notifications/stream?userId=${userId}`
    );

    eventSource.addEventListener("notification", (e) => {
      try {
        const data = JSON.parse(e.data);
        const notification = {
          id: data.id || Date.now(),
          timestamp: data.timestamp || new Date().toISOString(),
          read: false,
          message: data.message || "New notification",
          type: data.type || "info",
        };

        // Show toast
        if (notification.type === "error") toast.error(notification.message);
        else if (notification.type === "warning") toast.warning(notification.message);
        else toast.success(notification.message);

        // Add to state + session
        setNotifications((prev) => {
          const updated = [notification, ...prev];
          sessionStorage.setItem("notifications", JSON.stringify(updated));
          return updated;
        });
        setUnreadCount((prev) => {
          const updatedCount = prev + 1;
          sessionStorage.setItem("unreadCount", updatedCount.toString());
          return updatedCount;
        });
      } catch (err) {
        console.error("Invalid SSE message", err);
      }
    });

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [userId]);

  // === helpers ===
  const markAsRead = (id) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      sessionStorage.setItem("notifications", JSON.stringify(updated));
      return updated;
    });
    setUnreadCount((prev) => {
      const updated = Math.max(0, prev - 1);
      sessionStorage.setItem("unreadCount", updated.toString());
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      sessionStorage.setItem("notifications", JSON.stringify(updated));
      return updated;
    });
    setUnreadCount(0);
    sessionStorage.setItem("unreadCount", "0");
  };

  const clearNotification = (id) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      sessionStorage.setItem("notifications", JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    sessionStorage.removeItem("notifications");
    sessionStorage.removeItem("unreadCount");
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
