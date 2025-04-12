
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { OrderStatusSelect } from "./OrderStatusSelect";
import { Separator } from "@/components/ui/separator";

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
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Detalhes do Pedido {order.id}</DialogTitle>
            <OrderStatusSelect 
              orderId={order.id}
              currentStatus={order.status}
              onStatusChange={onStatusChange}
            />
          </div>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold">Cliente</h4>
              <p className="text-sm">{order.cliente}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Telefone</h4>
              <p className="text-sm">{order.telefone}</p>
            </div>
            <div className="col-span-2">
              <h4 className="text-sm font-semibold">Endereço</h4>
              <p className="text-sm">{order.endereco}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Data</h4>
              <p className="text-sm">{order.data}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Pagamento</h4>
              <p className="text-sm">{order.pagamento}</p>
            </div>
          </div>

          <Separator />
          
          <div>
            <h4 className="font-semibold mb-2">Itens do Pedido</h4>
            <div className="space-y-3">
              {order.itens.map((item, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.quantidade}x {item.nome}</span>
                    <span>{item.valor}</span>
                  </div>
                  {item.observacao && (
                    <p className="text-sm text-muted-foreground mt-1">{item.observacao}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />
          
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="text-sm">Taxa de Entrega</span>
              <span className="text-sm">{order.taxaEntrega}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{order.total}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onPrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir Pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
