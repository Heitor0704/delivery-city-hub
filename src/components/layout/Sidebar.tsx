
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, PackageSearch, ClipboardList, Store, Users, Package, 
  CreditCard, BarChart3, Settings, Building, Map, UserCog, LogOut, 
  ChevronLeft, ChevronRight, ShoppingBag
} from "lucide-react";
import { FomeXLogo } from "@/components/ui/logo";

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
        "flex items-center gap-3 rounded-md px-3 py-2 text-base transition-all hover:bg-fomex-orange/10 hover:text-fomex-orange",
        isActive && "bg-fomex-orange/10 text-fomex-orange font-medium",
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
    { href: "/owner-dashboard", icon: LayoutDashboard, title: "Dashboard" },
    { href: "/owner/orders", icon: PackageSearch, title: "Pedidos" },
    { href: "/owner/menu", icon: ClipboardList, title: "Cardápio" },
    { href: "/owner/products", icon: Package, title: "Produtos" },
    { href: "/owner/payments", icon: CreditCard, title: "Financeiro" },
    { href: "/owner/reports", icon: BarChart3, title: "Relatórios" },
    { href: "/owner/settings", icon: Settings, title: "Configurações" },
  ];

  const cityManagerLinks = [
    { href: "/city-manager-dashboard", icon: LayoutDashboard, title: "Dashboard" },
    { href: "/city-manager/orders", icon: ShoppingBag, title: "Pedidos" },
    { href: "/city-manager/stores", icon: Store, title: "Estabelecimentos" },
    { href: "/city-manager/deliverers", icon: Users, title: "Entregadores" },
    { href: "/city-manager/registrations", icon: ClipboardList, title: "Cadastros" },
    { href: "/city-manager/commissions", icon: CreditCard, title: "Financeiro" },
    { href: "/city-manager/reports", icon: BarChart3, title: "Relatórios" },
    { href: "/city-manager/settings", icon: Settings, title: "Configurações" },
  ];

  const adminLinks = [
    { href: "/admin-dashboard", icon: LayoutDashboard, title: "Dashboard" },
    { href: "/admin/cities", icon: Map, title: "Cidades" },
    { href: "/admin/managers", icon: UserCog, title: "Gerentes" },
    { href: "/admin/companies", icon: Building, title: "Empresas" },
    { href: "/admin/registrations", icon: ClipboardList, title: "Cadastros" },
    { href: "/admin/financials", icon: CreditCard, title: "Financeiro" },
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
        "flex flex-col bg-white border-r border-gray-200 shadow-sm transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-64",
        className
      )}
    >
      <div className={cn(
        "h-16 flex items-center py-2",
        isCollapsed ? "justify-center px-2" : "px-4"
      )}>
        {!isCollapsed ? (
          <div className="flex items-center justify-between w-full">
            <FomeXLogo isCollapsed={false} />
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500" 
              onClick={toggleSidebar}
            >
              <ChevronLeft size={18} />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <FomeXLogo isCollapsed={true} />
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500 absolute right-0 top-5" 
              onClick={toggleSidebar}
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        )}
      </div>
      
      <ScrollArea className="flex-1 pt-2">
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
      
      <div className="mt-auto border-t border-gray-200 p-2">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full flex items-center gap-3 text-gray-700 hover:text-fomex-orange hover:bg-fomex-orange/10 rounded-md px-3 py-2",
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
