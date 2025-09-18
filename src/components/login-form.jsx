// login-form.jsx
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import {AuthService, GetProfile} from "../Services/AuthService"
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";

function LoginForm({ className, ...props }) {

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleLogin = async (e) =>{
    e.preventDefault();
    const result  = await AuthService({username, password});
    const profile = await GetProfile(result.token);
    if(result.token){
      localStorage.setItem("jwtToken", result.token);
      login(result.token); 
      console.log("login successful");
      navigate("/chat");
    }
    else{
      alert("invalid credentials");
    }

  }


  return (
    <div className={cn("h-screen w-full flex items-center justify-center bg-background px-4", className)} {...props}>
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="Username" type="text" placeholder="username" required value={username} 
                  onChange={(e)=>setUserName(e.target.value)}
                />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input id="password" type="password" required 
                value = {password} 
                onChange={(e)=>setPassword(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
            <p className="mt-2 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginForm
