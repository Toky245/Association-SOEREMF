import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import UserProfile, { User } from "@/components/UserProfile"; 

const logoSoeremf = "/lovable-uploads/c5d6aba5-7e98-4c61-9fda-fa60cc9c18ad.png";

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
   currentUser: User;
}

const Layout = ({ children, onLogout, currentUser }: LayoutProps) => {
  const isMobile = useIsMobile();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar onLogout={onLogout} role={currentUser.role} />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-card flex items-center px-4 gap-4">
            <SidebarTrigger className="md:inline-flex hidden" />
            <div className="flex items-center gap-3">
              <img
                src={logoSoeremf}
                alt="Logo S.O.E.RE.M.F"
                className="h-8 w-8 object-contain"
              />
              {!isMobile && <h1 className="font-semibold text-primary">S.O.E.RE.M.F</h1>}
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.email}</p>
              </div>
            
              <Avatar
                className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                onClick={() => setShowProfile(true)}
              >
                <AvatarFallback>
                  <AvatarInitials name={currentUser.name} />
                </AvatarFallback>
              </Avatar>
              {isMobile && (
                <Button
                  onClick={onLogout}
                  size="sm"
                  variant="ghost"
                  className="md:hidden p-2"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          </header>
          <main className="flex-1 p-3 sm:p-6 bg-background overflow-x-hidden pb-20 md:pb-6">
            {children}
          </main>
        </div>
        <MobileBottomNav role={currentUser.role} />
        <UserProfile
          open={showProfile}
          onOpenChange={setShowProfile}
          user={currentUser}
        />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
