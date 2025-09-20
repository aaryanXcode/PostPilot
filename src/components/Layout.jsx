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
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <div className="grid grid-cols-3 items-center p-2 sm:p-4 border-b shrink-0">
            <div className="justify-self-start">
              <SidebarTrigger />
            </div>
            <div className="justify-self-center">
              <Navbar/>
            </div>
            <div className="justify-self-end">
              <ThemeToggle />
            </div>
          </div>
          
          {/* Content area: do not scroll here; let inner pages manage scroll */}
          <div className="flex-1 w-full px-2 sm:px-4 py-4 sm:py-6 overflow-hidden min-h-0">
            <div className="max-w-4xl mx-auto w-full h-full min-h-0 flex flex-col">
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
