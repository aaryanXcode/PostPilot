

import { useState, useEffect } from "react";

const SSEEventHook = (url) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      setEvents((prev) => [...prev, JSON.parse(event.data)]);
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [url]);

  return events;
};

export default SSEEventHook;
