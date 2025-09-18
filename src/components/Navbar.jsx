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
import { Bell, Calendar, BarChart3, Layout, User, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [activeItem, setActiveItem] = useState("dashboard");

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        {/* Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList className="flex gap-2">
            {/* Dashboard */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  activeItem === "dashboard" && "bg-accent/50"
                )}
                onClick={() => setActiveItem("dashboard")}
              >
                <Link to="dashboard" className="flex items-center">
                  <Layout className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Scheduled */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  activeItem === "scheduled" && "bg-accent/50"
                )}
                onClick={() => setActiveItem("scheduled")}
              >
                <Link to="scheduled" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Scheduled
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Analytics */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  activeItem === "analytics" && "bg-accent/50"
                )}
                onClick={() => setActiveItem("analytics")}
              >
                <Link to="analytics" className="flex items-center">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side actions */}
        <div className="ml-auto flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              3
            </Badge>
          </Button>
        </div>
      </div>
    </div>
  );
};
