
import { useState } from "react";
import { Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

interface HeaderProps {
  toggleSidebarMobile: () => void;
}

export function Header({ toggleSidebarMobile }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  // Get the settings route based on user role
  const getSettingsRoute = () => {
    switch(user?.role) {
      case "owner":
        return "/owner/settings";
      case "cityManager":
        return "/city-manager/settings";
      case "admin":
        return "/admin/settings";
      default:
        return "/settings";
    }
  };

  return (
    <header className="h-16 border-b flex items-center px-4 bg-background">
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden mr-2"
        onClick={toggleSidebarMobile}
      >
        <Menu size={20} />
      </Button>
      
      <div className="flex-1">
        <h2 className="text-lg font-medium">
          {user?.role === "owner" && "Portal do Estabelecimento"}
          {user?.role === "cityManager" && "Portal do Gerente da Cidade"}
          {user?.role === "admin" && "Portal do Administrador"}
        </h2>
      </div>
      
      <div className="flex items-center gap-4">
        <NotificationDropdown />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || ""} />
                <AvatarFallback className="bg-fomex-orange text-white">
                  {user ? getInitials(user.full_name || user.email || "") : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-sm">
                <span className="font-medium">{user?.full_name || user?.email}</span>
                <span className="text-xs text-muted-foreground">
                  {user?.role === "owner" && "Estabelecimento"}
                  {user?.role === "cityManager" && "Gerente"}
                  {user?.role === "admin" && "Admin"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.full_name || user?.email}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.role === "owner" && "Dono do Estabelecimento"}
                  {user?.role === "cityManager" && "Gerente da Cidade"}
                  {user?.role === "admin" && "Administrador"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate(getSettingsRoute())}>
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onSelect={handleLogout}>
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
