import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import LogIn from "@/components/login-form";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/AuthContext";
import Example from "./components/Example";
import { ChatMessageContextProvider } from "@/components/ChatMessageContextProvider";
import { NotificationProvider } from "./components/NotificationProvider";
import Dashboard from "./components/Dashboard";
import Scheduled from "./components/Scheduled";
import Analytics from "./components/Analytics";

function App() {
  return (
    <div className="h-screen w-screen bg-background overflow-hidden">
      <AuthProvider>
        <ChatMessageContextProvider>
          <NotificationProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LogIn />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Protected layout routes */}
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                {/* Default page inside layout */}
                <Route index element={<Dashboard />} />  

                {/* Main pages */}
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="scheduled" element={<Scheduled />} />
                <Route path="analytics" element={<Analytics />} />

                {/* Chat pages */}
                <Route path="chat" element={<Example />} />
                <Route path="chat/:sessionIdSidebar" element={<Example />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </NotificationProvider>
        </ChatMessageContextProvider>

        <Toaster />
      </AuthProvider>
    </div>
  );
}

export default App;
