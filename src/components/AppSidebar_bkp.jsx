import { useEffect, useState } from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { ChatHistory } from "../Services/ChatService";
import { Home } from "lucide-react"; 
import { useAuth } from "@/components/AuthContext";
import {Link, useParams} from "react-router-dom";

export function AppSidebar() {
  const [chatItems, setChatItems] = useState([]);
  const { token } = useAuth(); 
  const { sessionIdSidebar } = useParams();
  

  useEffect(() => {
    // Fetch chat history on mount
    const fetchChatHistory = async () => {
      const data = await ChatHistory(token);
      if (data && !data.error) {
        // Map API response to sidebar items
        const items = data.map(chat => ({
          title: chat.title,
          url: `/chat/${chat.sessionId}`,
          icon: Home, // You can assign different icons if you want
          sessionId: chat.sessionId,
        }));
        setChatItems(items);
      } else {
        console.error("Failed to fetch chat history:", data.error);
      }
    };

    fetchChatHistory();
  }, [token]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chat History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatItems.map(item => (
                <SidebarMenuItem key={item.sessionId}>
                  <SidebarMenuButton asChild isActive={item.sessionId === sessionIdSidebar}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
