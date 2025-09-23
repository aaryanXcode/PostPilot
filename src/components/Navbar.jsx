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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "./NotificationProvider"
import { Bell, Calendar, BarChart3, Layout, User, Settings, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
   const { notifications, unreadCount, clearAllNotifications, markAsRead } = useNotifications();

  return (
    <div className="w-full">
  <div className="flex h-12 sm:h-16 items-center justify-center relative px-4">
    {/* Centered Navigation Menu */}
    <NavigationMenu>
      <NavigationMenuList className="flex gap-1 sm:gap-2">
        {/* Dashboard */}
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              "group inline-flex h-8 sm:h-9 w-max items-center justify-center rounded-md bg-background px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
              activeItem === "dashboard" && "bg-accent/50"
            )}
            onClick={() => setActiveItem("dashboard")}
          >
            <Link to="/dashboard" className="flex items-center">
              <Layout className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Dashboard</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Scheduled */}
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              "group inline-flex h-8 sm:h-9 w-max items-center justify-center rounded-md bg-background px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
              activeItem === "scheduled" && "bg-accent/50"
            )}
            onClick={() => setActiveItem("scheduled")}
          >
            <Link to="/scheduled" className="flex items-center">
              <Calendar className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Scheduled</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Analytics */}
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              "group inline-flex h-8 sm:h-9 w-max items-center justify-center rounded-md bg-background px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
              activeItem === "analytics" && "bg-accent/50"
            )}
            onClick={() => setActiveItem("analytics")}
          >
            <Link to="/analytics" className="flex items-center">
              <BarChart3 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Analytics</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Chat */}
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              "group inline-flex h-8 sm:h-9 w-max items-center justify-center rounded-md bg-background px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
              activeItem === "chat" && "bg-accent/50"
            )}
            onClick={() => setActiveItem("chat")}
          >
            <Link to="/chat" className="flex items-center">
              <MessageSquare className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Chat</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>

    {/* Right side actions */}
   
        <div className="flex items-center space-x-4 ml-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {notifications.length === 0 ? (
                <DropdownMenuItem className="text-center text-sm text-muted-foreground">
                  No notifications
                </DropdownMenuItem>
              ) : (
                notifications.map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={!n.read ? "font-semibold" : ""}
                  >
                    {n.message}
                  </DropdownMenuItem>
                ))
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={clearAllNotifications}
                className="text-red-500 cursor-pointer"
              >
                Clear All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
  </div>
</div>
  );
};
