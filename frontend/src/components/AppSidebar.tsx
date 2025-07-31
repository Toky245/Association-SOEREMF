import { useLocation, Link } from "react-router-dom";
import { 
  Users, 
  FileText, 
  Megaphone, 
  Wallet,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  onLogout: () => void;
  role: string;
}

export function AppSidebar({ onLogout, role }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  const allowedToSeeCompte = role === "Président" || role === "Vice Président";

  const menuItems = [
    { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
    { title: "Membres", url: "/membres", icon: Users },
    { title: "Annonces", url: "/annonces", icon: Megaphone },
    { title: "Trésorerie", url: "/tresorerie", icon: Wallet },
    allowedToSeeCompte && { title: "Compte", url: "/compte", icon: Users },
    { title: "À propos", url: "/reglement", icon: FileText },
  ].filter(Boolean); // supprime les items `false`

  return (
    <Sidebar className={`${isCollapsed ? "w-14" : "w-64"} hidden md:flex`}>
      <SidebarContent className="bg-card">
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url}
                      className={`flex items-center gap-3 ${
                        isActive(item.url) 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-accent"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <Button 
            onClick={onLogout}
            variant="outline" 
            className="w-full flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span>Déconnexion</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
