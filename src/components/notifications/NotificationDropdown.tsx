
import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Mock data for notifications
type Notification = {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
  type: "info" | "warning" | "success" | "error";
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Novo pedido recebido",
    description: "Pedido #1234 foi recebido e aguarda confirmação.",
    date: "5 min atrás",
    read: false,
    type: "info"
  },
  {
    id: "2",
    title: "Pagamento confirmado",
    description: "O pagamento do pedido #1230 foi confirmado.",
    date: "1 hora atrás",
    read: false,
    type: "success"
  },
  {
    id: "3",
    title: "Pedido cancelado",
    description: "O cliente cancelou o pedido #1229.",
    date: "3 horas atrás",
    read: true,
    type: "error"
  },
  {
    id: "4",
    title: "Novo entregador cadastrado",
    description: "João Silva se cadastrou como entregador.",
    date: "1 dia atrás",
    read: true,
    type: "info"
  },
  {
    id: "5",
    title: "Atraso na entrega",
    description: "Pedido #1225 está com atraso na entrega.",
    date: "1 dia atrás",
    read: true,
    type: "warning"
  }
];

const getNotificationIconColor = (type: Notification["type"]) => {
  switch (type) {
    case "info":
      return "bg-blue-100 text-blue-600";
    case "warning":
      return "bg-yellow-100 text-yellow-600";
    case "success":
      return "bg-green-100 text-green-600";
    case "error":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export function NotificationDropdown() {
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter(notification => !notification.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-fomex-orange text-white rounded-full text-xs flex items-center justify-center animate-pulse-notification">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notificações</h4>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-auto p-1"
            onClick={markAllAsRead}
          >
            Marcar todas como lidas
          </Button>
        </div>
        {notifications.length > 0 ? (
          <ScrollArea className="h-[300px]">
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={cn(
                    "p-3 hover:bg-gray-50 cursor-pointer transition-colors",
                    !notification.read && "bg-gray-50"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center mt-1",
                      getNotificationIconColor(notification.type)
                    )}>
                      <Bell size={14} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <span className="text-xs text-gray-500">{notification.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-fomex-orange mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>Não há notificações no momento.</p>
          </div>
        )}
        <div className="p-3 text-center border-t">
          <Button variant="link" size="sm" className="text-xs">
            Ver todas as notificações
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
