"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Bell, Calendar, BarChart3, Layout, User, Settings, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [activeItem, setActiveItem] = useState("dashboard");

  return (
    <div className="w-full relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1 right-4 animate-pulse delay-200">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"></div>
        </div>
        <div className="absolute bottom-1 left-4 animate-pulse delay-400">
          <div className="w-1 h-1 bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-lg"></div>
        </div>
      </div>

      <div className="flex h-12 sm:h-16 items-center justify-center relative px-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
        {/* Centered Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList className="flex gap-1 sm:gap-2">
            {/* Dashboard */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  "group inline-flex h-8 sm:h-9 w-max items-center justify-center rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  activeItem === "dashboard" 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" 
                    : "bg-white/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white shadow-md hover:shadow-lg"
                )}
                onClick={() => setActiveItem("dashboard")}
              >
                <Link to="/dashboard" className="flex items-center">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-2">
                    <Layout className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <span className="hidden xs:inline font-semibold">Dashboard</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Scheduled */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  "group inline-flex h-8 sm:h-9 w-max items-center justify-center rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  activeItem === "scheduled" 
                    ? "bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg" 
                    : "bg-white/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-500 hover:text-white shadow-md hover:shadow-lg"
                )}
                onClick={() => setActiveItem("scheduled")}
              >
                <Link to="/scheduled" className="flex items-center">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-2">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <span className="hidden xs:inline font-semibold">Scheduled</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Analytics */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  "group inline-flex h-8 sm:h-9 w-max items-center justify-center rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  activeItem === "analytics" 
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg" 
                    : "bg-white/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white shadow-md hover:shadow-lg"
                )}
                onClick={() => setActiveItem("analytics")}
              >
                <Link to="/analytics" className="flex items-center">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-2">
                    <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <span className="hidden xs:inline font-semibold">Analytics</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Chat */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  "group inline-flex h-8 sm:h-9 w-max items-center justify-center rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  activeItem === "chat" 
                    ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg" 
                    : "bg-white/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white shadow-md hover:shadow-lg"
                )}
                onClick={() => setActiveItem("chat")}
              >
                <Link to="/chat" className="flex items-center">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-2">
                    <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <span className="hidden xs:inline font-semibold">AI Chat</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side actions */}
        <div className="flex items-center space-x-4 ml-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative bg-white/60 dark:bg-gray-700/60 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-orange-500 hover:text-white transition-all duration-300 rounded-xl shadow-md hover:shadow-lg"
          >
            <Bell className="h-4 w-4" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 animate-pulse"
            >
              3
            </Badge>
          </Button>
        </div>
      </div>
    </div>
  );
};
