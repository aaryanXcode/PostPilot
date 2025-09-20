import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

export default function ProtectedRoute({ children, roles }) {
    const { token, role, logout } = useAuth();

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                }
            } catch (error) {
                console.error("Token validation error:", error);
                logout();
            }
        }
    }, [token, logout]);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}
