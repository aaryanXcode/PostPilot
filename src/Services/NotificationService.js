import {Client } from "@stomp/stompjs";

const client = new Client({
    brokerURL: 'ws://localhost:8080/ws',
    reconnectDelay: 5000,
    debug: (str) => console.log(str),
});

client.onConnect = () => {
  console.log('Connected ✅');

  // Subscribe to personal notifications
  client.subscribe('/user/queue/notifications', (message) => {
    console.log('📩 Personal notification:', JSON.parse(message.body));
  });

  // Subscribe to role-based notifications (e.g., admins)
  client.subscribe('/topic/admin', (message) => {
    console.log('📩 Admin broadcast:', JSON.parse(message.body));
  });
};

client.activate();