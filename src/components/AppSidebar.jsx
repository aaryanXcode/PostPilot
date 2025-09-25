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
import { Home, Plus, MoreHorizontal, Pencil, Trash, UserCircle, LogOut } from "lucide-react"; 
import { useAuth } from "@/components/AuthContext";
import {Link, useParams, useNavigate, Navigate} from "react-router-dom";
import { useMessages } from "@/components/ChatMessageContextProvider";
import { ChatMessageHistory, DeleteChatSession, UpdateChatTitle } from "../Services/ChatService";


export function AppSidebar() {
  const [chatItems, setChatItems] = useState([]);
  const { token, user, role, logout } = useAuth(); 
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

const handleLogout = () => {
  logout();
  navigate("/login");
};





  return (
    <Sidebar className="bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-r-0">
      <SidebarHeader className="p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-2 right-2 animate-bounce delay-100">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-2 left-2 animate-bounce delay-300">
            <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="relative z-10">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-2 shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Chat
            </h2>
          </div>
          
          <button 
            onClick={handleNewChat}
            className="flex items-center gap-2 w-full p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Plus size={16} />
            <span className="font-medium">New Chat</span>
          </button>
        </div>
      </SidebarHeader>
      <SidebarContent className="relative">
        {/* Floating AI Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-4 animate-pulse delay-200">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-full shadow-lg"></div>
          </div>
          <div className="absolute bottom-20 left-4 animate-pulse delay-400">
            <div className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg"></div>
          </div>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            Chat History
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatList.map(item => (
                <SidebarMenuItem key={item.sessionId}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={item.sessionId === sessionIdSidebar}
                    className="group hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-300 rounded-lg"
                  >
                    <Link to={item.url} className="flex items-center gap-3 p-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      {editingId === item.sessionId ? (
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          onBlur={() => handleSaveTitle(item.sessionId)}
                          onKeyDown={(e) => e.key === "Enter" && handleSaveTitle(item.sessionId)}
                          className="flex-1 bg-transparent border-b border-blue-500 focus:outline-none text-sm font-medium text-gray-700 dark:text-gray-300"
                          autoFocus
                        />
                      ) : (
                        <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                          {item.title}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction className="hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-300 rounded-lg">
                        <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-2xl rounded-xl">
                      <DropdownMenuItem 
                        onClick={() => handleEditChat(item.sessionId, item.title)}
                        className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                      >
                        <Pencil className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-gray-700 dark:text-gray-300">Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteChat(item.sessionId)}
                        className="hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                      >
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
      
      {/* User Profile Section at Bottom */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 hover:from-blue-100 hover:to-purple-100 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 group">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <UserCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {role || 'Role'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 group"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Sidebar>
  );
}
