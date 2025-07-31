import { useLocation, Link } from "react-router-dom";
import {
  Users,
  FileText,
  Megaphone,
  Wallet,
  LayoutDashboard,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MobileBottomNavProps {
  role: string;
}

export function MobileBottomNav({ role }: MobileBottomNavProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const allowedToSeeCompte = role === "Président" || role === "Vice Président";

  const menuItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Membres", url: "/membres", icon: Users },
    { title: "Annonces", url: "/annonces", icon: Megaphone },
    { title: "Trésorerie", url: "/tresorerie", icon: Wallet },
    allowedToSeeCompte && { title: "Compte", url: "/compte", icon: Users },
    { title: "À propos", url: "/reglement", icon: FileText },
  ].filter(Boolean); // supprime les faux items

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <TooltipProvider>
        <div className="flex justify-around items-center py-2 px-1">
          {menuItems.map((item) => (
            <Tooltip key={item.title}>
              <TooltipTrigger asChild>
                <Link
                  to={item.url}
                  className={`flex flex-col items-center justify-center gap-1 p-1.5 rounded-md transition-colors ${
                    isActive(item.url)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  style={{ minWidth: "48px" }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-[11px] font-medium leading-tight max-w-[60px] text-center truncate">
                    {item.title}
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="mb-2">
                <p>{item.title}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
