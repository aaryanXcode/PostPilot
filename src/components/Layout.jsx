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
    <div className="h-screen w-screen flex bg-background overflow-hidden">
      <SidebarProvider>
        {/* Sidebar */}
        <AppSidebar />
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between p-4 border-b shrink-0">
            <SidebarTrigger />
            <Navbar/>
            <ThemeToggle />
          </div>
          {/* Scrollable content area */}
          <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 overflow-y-auto">
            {/* This Outlet will render the nested route components (Example) */}
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default Layout;