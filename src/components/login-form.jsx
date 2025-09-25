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

  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
  const [showSequentialAnimation, setShowSequentialAnimation] = useState(false);
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowLoadingAnimation(true);
    
    // Start sequential animation after icons converge
    setTimeout(() => {
      setShowSequentialAnimation(true);
      startSequentialAnimation();
    }, 1000);
    
    // Simulate loading time for animation
    setTimeout(async () => {
    try {
      const result = await AuthService({ username, password });
      
      if (result.token) {
        login(result.token);
        console.log("login successful");
        navigate("/dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
      } finally {
        setIsLoading(false);
        setShowLoadingAnimation(false);
        setShowSequentialAnimation(false);
        setCurrentIconIndex(0);
      }
    }, 4000); // 4 second animation
  }

  const startSequentialAnimation = () => {
    const icons = ['linkedin', 'facebook', 'instagram', 'twitter', 'pinterest'];
    let index = 0;
    
    const interval = setInterval(() => {
      setCurrentIconIndex(index);
      
      // Add screen vibration effect
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
      
      index = (index + 1) % icons.length;
    }, 500); // Each icon shows for 500ms (faster)
    
    // Clear interval after animation completes
    setTimeout(() => {
      clearInterval(interval);
    }, 3000);
  }

  return (
    <div className={cn("min-h-screen w-full relative overflow-auto", className)} {...props}>
      {/* Animated Background */}
      <div className={`fixed inset-0 transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
        {/* Floating Social Media Icons - Mobile Responsive */}
        {/* Instagram - Position 1 in circle */}
        <div className={`absolute transition-all duration-1000 ${showLoadingAnimation ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -translate-x-16' : 'top-16 sm:top-20 left-4 sm:left-10'} ${showLoadingAnimation ? '' : 'animate-bounce delay-100'}`}>
          <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-1000 ${currentIconIndex === 0 ? 'animate-bounce scale-110' : ''}`}>
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
        </div>
        
        {/* Twitter - Position 2 in circle */}
        <div className={`absolute transition-all duration-1000 ${showLoadingAnimation ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -translate-x-8 -translate-y-12' : 'top-32 sm:top-40 right-4 sm:right-20'} ${showLoadingAnimation ? '' : 'animate-bounce delay-300'}`}>
          <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-sky-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-1000 ${currentIconIndex === 1 ? 'animate-bounce scale-110' : ''}`}>
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </div>
        </div>

        {/* Pinterest - Position 3 in circle */}
        <div className={`absolute transition-all duration-1000 ${showLoadingAnimation ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-x-8 -translate-y-12' : 'top-48 sm:top-60 left-1/4'} ${showLoadingAnimation ? '' : 'animate-bounce delay-500'}`}>
          <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-red-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-1000 ${currentIconIndex === 2 ? 'animate-bounce scale-110' : ''}`}>
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
            </svg>
          </div>
        </div>

        {/* Facebook - Position 4 in circle */}
        <div className={`absolute transition-all duration-1000 ${showLoadingAnimation ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-x-16' : 'bottom-32 sm:bottom-40 right-4 sm:right-10'} ${showLoadingAnimation ? '' : 'animate-bounce delay-700'}`}>
          <div className={`w-16 h-16 sm:w-18 sm:h-18 bg-blue-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-1000 ${currentIconIndex === 3 ? 'animate-bounce scale-110' : ''}`}>
            <svg className="w-8 h-8 sm:w-9 sm:h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
        </div>

        {/* LinkedIn - Position 5 in circle */}
        <div className={`absolute transition-all duration-1000 ${showLoadingAnimation ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-x-8 translate-y-12' : 'top-24 sm:top-28 right-8 sm:right-12'} ${showLoadingAnimation ? '' : 'animate-bounce delay-1000'}`}>
          <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-1000 ${currentIconIndex === 4 ? 'animate-bounce scale-110' : ''}`}>
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
        </div>

        {/* Animated Articles/Content Icons */}
        <div className="absolute top-1/3 right-1/4 animate-pulse delay-200">
          <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center shadow-lg transform rotate-12">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-1/3 left-1/5 animate-pulse delay-600">
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg transform -rotate-12">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {showLoadingAnimation && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-20 flex items-center justify-center">
          <div className={`relative w-32 h-32 flex items-center justify-center transition-transform duration-200 ${showSequentialAnimation ? 'animate-pulse' : ''}`}>
            {/* Sequential Icon Animation */}
            {showSequentialAnimation && (
              <div className="absolute inset-0 flex items-center justify-center">
                {/* LinkedIn */}
                {currentIconIndex === 0 && (
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                )}
                
                {/* Facebook */}
                {currentIconIndex === 1 && (
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                )}
                
                {/* Instagram */}
                {currentIconIndex === 2 && (
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                )}
                
                {/* Twitter */}
                {currentIconIndex === 3 && (
                  <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </div>
                )}
                
                {/* Pinterest */}
                {currentIconIndex === 4 && (
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                    </svg>
                  </div>
                )}
              </div>
            )}
            
            {/* Loading Text */}
            
          </div>
        </div>
      )}

      {/* Dark Mode Toggle */}
      <div className="fixed top-4 right-4 z-30">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white/90 transition-all duration-200"
        >
          {isDarkMode ? (
            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-4 mt-0">
        <div className="w-full max-w-sm">
          {/* Logo and Branding */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-2 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
              PostPilot
            </h1>
            <p className={`text-sm transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Your Social Media Command Center
            </p>
            <div className="flex justify-center space-x-1 mt-2 flex-wrap">
              <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">Instagram</span>
              <span className="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded-full">Twitter</span>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Pinterest</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Facebook</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">LinkedIn</span>
            </div>
          </div>

          {/* Login Card */}
          <Card className={`backdrop-blur-sm border-0 shadow-2xl rounded-xl transition-all duration-500 ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'}`}>
            <CardHeader className="text-center pb-2 px-4">
              <CardTitle className={`text-lg font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Welcome Back</CardTitle>
              <CardDescription className={`text-sm transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Sign in to manage your social media presence
          </CardDescription>
        </CardHeader>

            <CardContent className="px-4 pb-4">
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="username" className={`text-sm font-medium transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Username
                  </Label>
                  <div className="relative">
                    <Input 
                      id="username" 
                      type="text" 
                      placeholder="Enter your username" 
                      required 
                      value={username} 
                      onChange={(e) => setUserName(e.target.value)}
                      className={`pl-3 pr-3 py-2 border-2 rounded-lg focus:border-blue-500 focus:ring-0 transition-all duration-200 text-sm ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-200 bg-white text-gray-900 placeholder-gray-500'}`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
            </div>


                <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className={`text-sm font-medium transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Password
                  </Label>
                  <a href="#" className={`text-sm transition-colors duration-500 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                  Forgot password?
                </a>
              </div>

                  <div className="relative">
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter your password" 
                      required 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-3 pr-3 py-2 border-2 rounded-lg focus:border-blue-500 focus:ring-0 transition-all duration-200 text-sm ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-200 bg-white text-gray-900 placeholder-gray-500'}`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign In</span>
                    </div>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
            </div>


                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="py-2 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-lg transition-all duration-200 text-sm"
                  >
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
              </Button>

                  <Button 
                    variant="outline" 
                    className="py-2 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-lg transition-all duration-200 text-sm"
                  >
                    <svg className="w-4 h-4 mr-1" fill="#0077B5" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
              </Button>
            </div>

              </form>

              <div className="mt-4 text-center">
                <p className={`text-sm transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Don't have an account?{" "}
                  <a href="#" className={`font-medium transition-colors duration-500 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                    Sign up for free
              </a>
            </p>

              </div>
        </CardContent>
      </Card>


          {/* Features Preview */}
          
        </div>
      </div>
    </div>
  )
}

export default LoginForm

