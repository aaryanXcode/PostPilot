import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem("jwtToken");
                    return { token: null, role: null, user: null };
                }
                console.log("setting auth");
                return { token, role: decoded.role, user: decoded.sub };
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem("jwtToken");
                return { token: null, role: null, user: null };
            }
        }
        return { token: null, role: null, user: null };
    });

    useEffect(() => {
        if (!auth.token) return;
        
        try {
            const decoded = jwtDecode(auth.token);
            const remainingTime = decoded.exp * 1000 - Date.now();
            
            // If token is already expired, logout immediately
            if (remainingTime <= 0) {
                logout();
                return;
            }
            
            const timer = setTimeout(() => {
                logout();
            }, remainingTime);

            // Cleanup 
            return () => clearTimeout(timer);
        } catch (error) {
            console.error("Token validation error:", error);
            logout();
        }
    }, [auth.token]);

    const login = (jwtToken) => {
        try {
            console.log("login");
            localStorage.setItem("jwtToken", jwtToken);
            const decoded = jwtDecode(jwtToken);
            setAuth({ token: jwtToken, role: decoded.role, user: decoded.sub });
        } catch (error) {
            console.error("Login error:", error);
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem("jwtToken");
        setAuth({ token: null, role: null, user: null });
    };

    return (
        <AuthContext.Provider value={{ ...auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider };
export const useAuth = () => useContext(AuthContext);