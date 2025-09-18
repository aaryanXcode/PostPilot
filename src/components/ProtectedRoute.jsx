import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import { jwtDecode } from "jwt-decode";
export default function ProtectedRoute({ children, roles }) {
    const { token, role, logout } = useAuth();
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    
    return children;
}
