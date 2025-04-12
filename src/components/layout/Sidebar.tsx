
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { 
  Home, Store, Map, Users, Settings, CreditCard, FileText, 
  Bell, Package, LogOut, ChevronLeft, ChevronRight, 
  BarChart3, UserCog, Building
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  title: string;
  isCollapsed: boolean;
  isActive?: boolean;
}

function NavItem({ href, icon: Icon, title, isCollapsed, isActive }: NavItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
        isCollapsed ? "justify-center" : ""
      )}
    >
      <Icon size={20} />
      {!isCollapsed && <span>{title}</span>}
    </Link>
  );
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedState = localStorage.getItem("sidebarCollapsed");
    setIsCollapsed(savedState === "true");
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  if (!mounted) return null;

  const ownerLinks = [
    { href: "/owner-dashboard", icon: Home, title: "Dashboard" },
    { href: "/owner/menu", icon: Store, title: "Cardápio" },
    { href: "/owner/orders", icon: Package, title: "Pedidos" },
    { href: "/owner/payments", icon: CreditCard, title: "Pagamentos" },
    { href: "/owner/reports", icon: FileText, title: "Relatórios" },
    { href: "/owner/settings", icon: Settings, title: "Configurações" },
  ];

  const cityManagerLinks = [
    { href: "/city-manager-dashboard", icon: Home, title: "Dashboard" },
    { href: "/city-manager/stores", icon: Store, title: "Estabelecimentos" },
    { href: "/city-manager/deliverers", icon: Users, title: "Entregadores" },
    { href: "/city-manager/commissions", icon: CreditCard, title: "Comissões" },
    { href: "/city-manager/categories", icon: FileText, title: "Categorias" },
    { href: "/city-manager/reports", icon: BarChart3, title: "Relatórios" },
    { href: "/city-manager/settings", icon: Settings, title: "Configurações" },
  ];

  const adminLinks = [
    { href: "/admin-dashboard", icon: Home, title: "Dashboard" },
    { href: "/admin/cities", icon: Map, title: "Cidades" },
    { href: "/admin/managers", icon: UserCog, title: "Gerentes" },
    { href: "/admin/companies", icon: Building, title: "Empresas" },
    { href: "/admin/commissions", icon: CreditCard, title: "Comissões" },
    { href: "/admin/reports", icon: BarChart3, title: "Relatórios" },
    { href: "/admin/settings", icon: Settings, title: "Configurações" },
  ];

  let links = ownerLinks; // Default
  
  if (user) {
    switch (user.role) {
      case "cityManager":
        links = cityManagerLinks;
        break;
      case "admin":
        links = adminLinks;
        break;
      default:
        links = ownerLinks;
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-[60px]" : "w-64",
        className
      )}
    >
      <div className={cn(
        "h-14 flex items-center px-4 py-2",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && (
          <div className="flex items-center">
            <span className="font-bold text-sidebar-foreground">Delivery Hub</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-sidebar-foreground" 
          onClick={toggleSidebar}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <nav className="grid gap-1 px-2 py-3">
          {links.map((link) => (
            <NavItem
              key={link.href}
              href={link.href}
              icon={link.icon}
              title={link.title}
              isCollapsed={isCollapsed}
              isActive={location.pathname === link.href}
            />
          ))}
        </nav>
      </ScrollArea>
      
      <div className="mt-auto border-t border-sidebar-border p-2">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isCollapsed ? "justify-center" : ""
          )}
          asChild
        >
          <Link to="/logout">
            <LogOut size={18} />
            {!isCollapsed && <span>Sair</span>}
          </Link>
        </Button>
      </div>
    </div>
  );
}
