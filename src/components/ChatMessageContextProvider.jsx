import React, { createContext, useState, useContext } from "react";

const MessageContext = createContext();

export function ChatMessageContextProvider({ children }) {
  const [chatMessage, setChatMessages] = useState(null);
  const [chatList, setChatList] = useState([]);

  return (
    <MessageContext.Provider value={{ chatMessage, setChatMessages, chatList, setChatList }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  return useContext(MessageContext);
}
