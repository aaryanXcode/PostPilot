

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const NotificationContext = createContext([]);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const lastCount = useRef(0);
  const userId = "1"; // later: get from AuthContext

  useEffect(() => {
    // Connect to the SSE stream
    const eventSource = new EventSource(
      `http://localhost:8080/api/notifications/stream?userId=${userId}`
    );

    // Connection opened
    eventSource.onopen = () => {
      console.log("SSE connection opened");
    };

    // Listen for the "connected" confirmation event
    eventSource.addEventListener("connected", (e) => {
      console.log("✅ Connected:", JSON.parse(e.data));
    });

    // Listen for notifications sent by the server
    eventSource.addEventListener("notification", (e) => {
      try {
        const data = JSON.parse(e.data);
        toast.success("📩 Notification received:", data);
        setNotifications((prev) => [...prev, data]);
      } catch (err) {
        console.error("Invalid SSE message", err);
      }
    });

    // Handle generic messages (if any)
    eventSource.onmessage = (event) => {
      console.log("Generic SSE message:", event.data);
    };

    // Handle errors
    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };

    // Cleanup on unmount
    return () => eventSource.close();
  }, [userId]);

  // Show toast notifications
  useEffect(() => {
    if (notifications.length > lastCount.current) {
      const latest = notifications[notifications.length - 1];

      if (latest.type === "error") {
        toast.error(latest.message);
      } else if (latest.type === "warning") {
        toast.warning(latest.message);
      } else {
        toast.success(latest.message);
      }

      lastCount.current = notifications.length;
    }
  }, [notifications]);


  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
