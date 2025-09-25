// import Example from '@/components/Example'
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/AppSidebar"
// import { ThemeToggle } from "@/components/ThemeToggle"

// function Layout() {
//   return (
//     <div className="h-screen w-screen flex bg-background overflow-hidden">
//       <SidebarProvider>
//         {/* Sidebar */}
//         <AppSidebar />

//         {/* Main Content */}
//         <div className="flex-1 flex flex-col">
//           {/* Top bar */}
//           <div className="flex items-center justify-between p-4 border-b shrink-0">
//             <SidebarTrigger />
//             <ThemeToggle />
//           </div>

//           {/* Scrollable content area */}
//           <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 overflow-y-auto">
//             <Example />
//           </div>
//         </div>
//       </SidebarProvider>
//     </div>
//   );
// }

// export default Layout;

import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Navbar } from './Navbar';

function Layout() {
  return (
    <div className="h-screen w-screen flex bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 animate-pulse delay-200">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"></div>
        </div>
        <div className="absolute bottom-20 left-20 animate-pulse delay-400">
          <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-lg"></div>
        </div>
        <div className="absolute top-1/2 right-10 animate-pulse delay-600">
          <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full shadow-lg"></div>
        </div>
      </div>
      
      <SidebarProvider>
        {/* Sidebar */}
        <AppSidebar />
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          {/* Top bar */}
          <div className="grid grid-cols-3 items-center p-2 sm:p-4 border-b border-gray-200 dark:border-gray-700 shrink-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="justify-self-start">
              <SidebarTrigger className="hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-300 rounded-lg" />
            </div>
            <div className="justify-self-center">
              <Navbar/>
            </div>
            <div className="justify-self-end">
              <ThemeToggle />
            </div>
          </div>
          
          {/* Content area: allow scrolling */}
          <div className="flex-1 w-full px-2 sm:px-4 py-4 sm:py-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full min-h-full">
              {/* This Outlet will render the nested route components (Example) */}
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default Layout;
