
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Phone, MapPin, Calendar, CreditCard } from "lucide-react";
import { OrderStatusSelect } from "./OrderStatusSelect";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface OrderItem {
  nome: string;
  quantidade: number;
  valor: string;
  observacao: string;
}

interface Order {
  id: string;
  cliente: string;
  valor: string;
  data: string;
  status: string;
  endereco: string;
  telefone: string;
  itens: OrderItem[];
  pagamento: string;
  taxaEntrega: string;
  total: string;
}

interface OrderDetailsProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrint: () => void;
  onStatusChange: (status: string) => void;
}

const statusColors: Record<string, string> = {
  aguardando: "bg-yellow-100 text-yellow-800",
  preparando: "bg-blue-100 text-blue-800",
  entregando: "bg-purple-100 text-purple-800",
  entregue: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
};

export function OrderDetails({ 
  order, 
  open, 
  onOpenChange,
  onPrint,
  onStatusChange
}: OrderDetailsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="pb-2 border-b">
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                Pedido {order.id}
                <Badge className={statusColors[order.status]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">Alterar status:</p>
            </div>
            <OrderStatusSelect 
              orderId={order.id}
              currentStatus={order.status}
              onStatusChange={onStatusChange}
              className="min-w-[160px]"
            />
          </div>
        </DialogHeader>
        
        <div className="space-y-6 my-4">
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold">Cliente</h4>
                <p className="text-sm">{order.cliente}</p>
                <p className="text-sm text-gray-500">{order.telefone}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold">Data e Hora</h4>
                <p className="text-sm">{order.data}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 col-span-2">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold">Endereço de Entrega</h4>
                <p className="text-sm">{order.endereco}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 col-span-2">
              <CreditCard className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold">Pagamento</h4>
                <p className="text-sm">{order.pagamento}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">Itens do Pedido</h4>
            <div className="space-y-3">
              {order.itens.map((item, index) => (
                <div key={index} className="bg-white border border-gray-200 p-4 rounded-md shadow-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.quantidade}x {item.nome}</span>
                    <span className="font-medium">{item.valor}</span>
                  </div>
                  {item.observacao && (
                    <p className="text-sm text-gray-500 mt-2 italic">{item.observacao}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-gray-600">
                <span>Taxa de Entrega</span>
                <span>{order.taxaEntrega}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{order.total}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onPrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir Pedido
          </Button>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
