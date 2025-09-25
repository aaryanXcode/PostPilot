import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import LogIn from "@/components/login-form";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/components/AuthContext";
import Example from "./components/Example";
import { ChatMessageContextProvider } from "@/components/ChatMessageContextProvider";
import { NotificationProvider } from "./components/NotificationProvider";
import Dashboard from "./components/Dashboard";
import Scheduled from "./components/Scheduled";
import Analytics from "./components/Analytics";

// Component to handle authenticated routes
function AuthenticatedRoutes() {
  const { token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      {/* Protected layout routes */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        {/* Main pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scheduled" element={<Scheduled />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/chat" element={<Example />} />
        <Route path="/chat/:sessionIdSidebar" element={<Example />} />
        
        {/* Fallback route for unknown paths - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <div className="h-screen w-screen bg-background overflow-y-auto">
      <AuthProvider>
        <ChatMessageContextProvider>
          <NotificationProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LogIn />} />
              
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* All other routes are protected */}
              <Route path="/*" element={<AuthenticatedRoutes />} />
            </Routes>
          </NotificationProvider>
        </ChatMessageContextProvider>
        <Toaster />
      </AuthProvider>
    </div>
  );
}

export default App;
