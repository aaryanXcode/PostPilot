import {Client } from "@stomp/stompjs";

const client = new Client({
    brokerURL: import.meta.env.VITE_WS_BROKER_URL,
    reconnectDelay: 5000,
    debug: (str) => {/* console.log(str); */},
});

client.onConnect = () => {
  // console.log('Connected ✅');

  // Subscribe to personal notifications
  client.subscribe(import.meta.env.VITE_WS_USER_NOTIFICATIONS, (message) => {
    // console.log('📩 Personal notification:', JSON.parse(message.body));
  });

  // Subscribe to role-based notifications (e.g., admins)
  client.subscribe(import.meta.env.VITE_WS_ADMIN_NOTIFICATIONS, (message) => {
    // console.log('📩 Admin broadcast:', JSON.parse(message.body));
  });
};

client.activate();