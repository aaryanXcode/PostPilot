import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  // Use actual user ID from auth context, fallback to "1" for development
  const userId = user?.id?.toString() || "1";

  // Load from sessionStorage on mount
  useEffect(() => {
    const savedNotifications = JSON.parse(sessionStorage.getItem("notifications") || "[]");
    const savedCount = parseInt(sessionStorage.getItem("unreadCount") || "0");
    setNotifications(savedNotifications);
    setUnreadCount(savedCount);
  }, []);

  // SSE listener
  useEffect(() => {
    if (!userId) return; // Don't connect if no user ID
    
    // console.log('🔔 Connecting to notifications for user:', userId);
    const eventSource = new EventSource(
      `http://localhost:8080/api/notifications/stream?userId=${userId}`
    );

    eventSource.addEventListener("notification", (e) => {
      try {
        const data = JSON.parse(e.data);
        // console.log('📩 Received notification:', data);
        
        const notification = {
          id: data.id || Date.now(),
          timestamp: data.timestamp || new Date().toISOString(),
          read: false,
          message: data.message || data.title || "New notification",
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

    eventSource.addEventListener("connected", (e) => {
      // console.log('🔔 SSE Connected:', e.data);
    });

    eventSource.onopen = () => {
      // console.log('🔔 SSE Connection opened for user:', userId);
    };

    eventSource.onerror = (err) => {
      console.error("❌ SSE error for user:", userId, err);
      eventSource.close();
    };

    return () => {
      // console.log('🔔 Closing SSE connection for user:', userId);
      eventSource.close();
    };
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

  // Test function to send a test notification
  const sendTestNotification = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/notifications/test?userId=${userId}`);
      if (response.ok) {
        // console.log('✅ Test notification sent successfully');
      } else {
        console.error('❌ Failed to send test notification:', response.status);
      }
    } catch (error) {
      console.error('❌ Error sending test notification:', error);
    }
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
        sendTestNotification,
        userId,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
