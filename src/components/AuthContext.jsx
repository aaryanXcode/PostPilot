import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

const AuthProvider = ({children}) =>{

    const [auth, setAuth] = useState(()=>{
        const token = localStorage.getItem("jwtToken");
        if(token){
            console.log("setting auth");
            const decoded = jwtDecode(token);
            return { token, role: decoded.role, user: decoded.sub };
        }
        return { token: null, role: null, user: null };
    });

    useEffect(()=>{
        if(!auth.token) return ;
        const decoded = jwtDecode(auth.token);
        const remainingTime = decoded.exp * 1000 - Date.now();
        const timer = setTimeout(()=>{
            logout
        },remainingTime);

        //cleanup 
        return ()=>clearTimeout(timer);
    },[auth.token])

    const login = (jwtToken) => {
        console.log("login");
        localStorage.setItem("jwtToken", jwtToken);
        const decoded = jwtDecode(jwtToken);
        setAuth({ token: jwtToken, role: decoded.role, user: decoded.sub });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setAuth({ token: null, role: null, user: null });
    };
    return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export { AuthProvider };
export const useAuth = () => useContext(AuthContext);