import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
const logoSoeremf = "/lovable-uploads/c5d6aba5-7e98-4c61-9fda-fa60cc9c18ad.png";

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const Layout = ({ children, onLogout }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar onLogout={onLogout} />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-card flex items-center px-4 gap-4">
            <SidebarTrigger />
            <div className="flex items-center gap-3">
              <img 
                src={logoSoeremf} 
                alt="Logo S.O.E.RE.M.F" 
                className="h-8 w-8 object-contain"
              />
              <h1 className="font-semibold text-primary">S.O.E.RE.M.F</h1>
            </div>
            <div className="ml-auto">
              <span className="text-sm text-muted-foreground">
                Tableau de bord
              </span>
            </div>
          </header>
          <main className="flex-1 p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;