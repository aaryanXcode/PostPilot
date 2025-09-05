import ChatInterface from '@/components/ui/shadcn-io/ai/ChatInterface'
import Example from './components/Example'
import { Toaster } from 'sonner';
import { ThemeToggle } from './components/ThemeToggle';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"

function App() {
  return (
    <div className="h-screen w-full flex bg-background">
      {/* Sidebar Section */}
      <SidebarProvider>
        <AppSidebar />

        {/* Main Content */}
        <div className="flex-1 relative">
          {/* Top bar with sidebar toggle & theme toggle */}
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger />
            <ThemeToggle />
          </div>

          {/* Main content centered */}
          <div className="h-[calc(100%-64px)] max-w-4xl mx-auto flex flex-col justify-center px-4">
            <Toaster />
            <Example />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}


export default App;

