import { useEffect, useState } from "react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuAction } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChatHistory, CreateNewSession } from "../Services/ChatService";
import { Home, Plus, MoreHorizontal, Pencil, Trash } from "lucide-react"; 
import { useAuth } from "@/components/AuthContext";
import {Link, useParams, useNavigate, Navigate} from "react-router-dom";
import { useMessages } from "@/components/ChatMessageContextProvider";
import { ChatMessageHistory, DeleteChatSession, UpdateChatTitle } from "../Services/ChatService";


export function AppSidebar() {
  const [chatItems, setChatItems] = useState([]);
  const { token } = useAuth(); 
  const { sessionIdSidebar } = useParams();
  const navigate = useNavigate();
  const { chatMessage, chatList, setChatList } = useMessages();
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    // Fetch chat history on mount
    const fetchChatHistory = async () => {
      const data = await ChatHistory(token);
      if (data && !data.error) {
        // Map API response to sidebar items
        const items = data.map(chat => ({
          title: chat.title || "New Chat",
          url: `/chat/${chat.sessionId}`,
          icon: Home, // You can assign different icons if you want
          sessionId: chat.sessionId,
        }));
        //setChatItems(items);
        setChatList(items);
      } else {
        console.error("Failed to fetch chat history:", data.error);
      }
    };

    fetchChatHistory();
  }, [token, setChatList]);



const handleNewChat = async () => {
  try {
    // Check if current session has no messages
    const history = await ChatMessageHistory(sessionIdSidebar, token, 0, 1);
    if (history?.content?.length === 0) {
      navigate(`/chat/${sessionIdSidebar}`);
      return;
    }

    // Else create fresh session
    const result = await CreateNewSession(token);
    if (result?.sessionId) {
      navigate(`/chat/${result.sessionId}`);
      // setChatItems(prev => [
      // ...prev,
      //   { title: "New Chat", url: `/chat/${result.sessionId}`, icon: Home, sessionId: result.sessionId }
      // ]);
      setChatList(prev => [...prev, { title: "New Chat", url: `/chat/${result.sessionId}`, icon: Home, sessionId: result.sessionId }
      ]);

    }
  } catch (err) {
    console.error("Unexpected error creating session:", err);
  }
};

const handleDeleteChat = async (sessionId) => {
  try {
    await DeleteChatSession(sessionId, token);
    setChatList(prev => prev.filter(item => item.sessionId !== sessionId));

    // if the current session was deleted, navigate away
    if (sessionIdSidebar === sessionId) {
      navigate("/chat"); 
    }
  } catch (err) {
    console.error("Failed to delete chat session:", err);
  }
};


const handleEditChat = (sessionId, currentTitle) => {
  setEditingId(sessionId);
  setNewTitle(currentTitle);
};

const handleSaveTitle = async (sessionId) => {
  try {
    console.log(sessionId, newTitle, token);
    await UpdateChatTitle(sessionId, newTitle, token);
    setChatList(prev =>
      prev.map(item =>
        item.sessionId === sessionId ? { ...item, title: newTitle } : item
      )
    );
    setEditingId(null); // exit edit mode
  } catch (err) {
    console.error("Failed to update chat title:", err);
  }
};




  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <button 
          onClick={handleNewChat}
          className="flex items-center gap-2 w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          New Chat
        </button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chat History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatList.map(item => (
                <SidebarMenuItem key={item.sessionId}>
                  {/* <SidebarMenuButton asChild isActive={item.sessionId === sessionIdSidebar}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>

                  </SidebarMenuButton> */}
                  <SidebarMenuButton asChild isActive={item.sessionId === sessionIdSidebar}>
                    <Link to={item.url}>
                      <item.icon />
                      {editingId === item.sessionId ? (
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          onBlur={() => handleSaveTitle(item.sessionId)}   // save on blur
                          onKeyDown={(e) => e.key === "Enter" && handleSaveTitle(item.sessionId)} // save on Enter
                          className="border rounded px-1 ml-2"
                          autoFocus
                        />
                      ) : (
                        <span>{item.title}</span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction>
                        <MoreHorizontal />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                      <DropdownMenuItem onClick={() => handleEditChat(item.sessionId, item.title)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteChat(item.sessionId)}>
                        <Trash className="mr-2 h-4 w-4 text-red-500" />
                        <span className="text-red-500">Delete</span>
                      </DropdownMenuItem>

                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
