import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu as Dropdown,
  DropdownMenuContent as DropdownContent,
  DropdownMenuItem as DropdownItem,
  DropdownMenuTrigger as DropdownTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, Filter, Printer, MoreVertical, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OrderDetails } from "@/components/order/OrderDetails";
import { OrderStatusSelect } from "@/components/order/OrderStatusSelect";

const statusColors: Record<string, string> = {
  aguardando: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  preparando: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  entregando: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  entregue: "bg-green-100 text-green-800 hover:bg-green-100",
  cancelado: "bg-red-100 text-red-800 hover:bg-red-100",
};

const orders = [
  {
    id: "#PED-1234",
    cliente: "João Silva",
    valor: "R$ 54,90",
    data: "12/04/2023 14:30",
    status: "aguardando",
    endereco: "Rua das Flores, 123",
    itens: [
      { nome: "X-Tudo", quantidade: 1, valor: "R$ 28,90", observacao: "Sem cebola" },
      { nome: "Coca-Cola 350ml", quantidade: 2, valor: "R$ 13,00", observacao: "" },
      { nome: "Batata Frita Grande", quantidade: 1, valor: "R$ 13,00", observacao: "Bem passada" },
    ],
    pagamento: "Cartão de crédito",
    taxaEntrega: "R$ 5,00",
    total: "R$ 59,90",
    telefone: "(11) 98765-4321"
  },
  {
    id: "#PED-1235",
    cliente: "Maria Souza",
    valor: "R$ 32,50",
    data: "12/04/2023 14:20",
    status: "preparando",
    endereco: "Av. Principal, 456",
    itens: [
      { nome: "X-Salada", quantidade: 1, valor: "R$ 22,90", observacao: "" },
      { nome: "Suco de Laranja", quantidade: 1, valor: "R$ 7,50", observacao: "Sem gelo" }
    ],
    pagamento: "Dinheiro",
    taxaEntrega: "R$ 5,00",
    total: "R$ 37,50",
    telefone: "(11) 91234-5678"
  },
  {
    id: "#PED-1236",
    cliente: "Pedro Almeida",
    valor: "R$ 78,90",
    data: "12/04/2023 14:05",
    status: "entregando",
    endereco: "Rua das Árvores, 789",
    itens: [
      { nome: "Pizza Grande Calabresa", quantidade: 1, valor: "R$ 49,90", observacao: "Borda com catupiry" },
      { nome: "Refrigerante 2L", quantidade: 1, valor: "R$ 12,00", observacao: "" },
      { nome: "Sobremesa Petit Gateau", quantidade: 1, valor: "R$ 17,00", observacao: "" }
    ],
    pagamento: "Pix",
    taxaEntrega: "R$ 5,00",
    total: "R$ 83,90",
    telefone: "(11) 97890-1234"
  },
  {
    id: "#PED-1237",
    cliente: "Ana Costa",
    valor: "R$ 45,00",
    data: "12/04/2023 13:50",
    status: "entregue",
    endereco: "Rua da Praça, 101",
    itens: [
      { nome: "Combo Hamburguer + Batata + Refrigerante", quantidade: 1, valor: "R$ 40,00", observacao: "" }
    ],
    pagamento: "Cartão de débito",
    taxaEntrega: "R$ 5,00",
    total: "R$ 45,00",
    telefone: "(11) 95678-9012"
  },
  {
    id: "#PED-1238",
    cliente: "Carlos Mendes",
    valor: "R$ 27,80",
    data: "12/04/2023 13:45",
    status: "cancelado",
    endereco: "Av. Central, 202",
    itens: [
      { nome: "Sanduíche Natural", quantidade: 1, valor: "R$ 15,90", observacao: "" },
      { nome: "Água Mineral", quantidade: 1, valor: "R$ 3,90", observacao: "" },
      { nome: "Salada de Frutas", quantidade: 1, valor: "R$ 8,00", observacao: "" }
    ],
    pagamento: "Mercado Pago",
    taxaEntrega: "R$ 5,00",
    total: "R$ 32,80",
    telefone: "(11) 94321-8765"
  },
];

export default function OwnerOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const { toast } = useToast();

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "todos" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    // Em um ambiente real, aqui faríamos uma chamada à API para atualizar o status
    // Por enquanto, apenas mostramos um toast de confirmação
    toast({
      title: "Status atualizado",
      description: `Pedido ${orderId} teve seu status alterado para ${newStatus}`,
    });
  };

  const handlePrintOrder = (order: any) => {
    // Abre uma nova janela para impressão
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Erro ao imprimir",
        description: "Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está ativado.",
        variant: "destructive",
      });
      return;
    }

    // Conteúdo HTML para impressão
    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Pedido ${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; }
            .order-header { margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
            .order-items { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { text-align: left; padding: 8px; }
            th { border-bottom: 1px solid #ddd; }
            .total-row { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Pedido ${order.id}</h1>
          <div class="order-header">
            <p><strong>Cliente:</strong> ${order.cliente}</p>
            <p><strong>Telefone:</strong> ${order.telefone}</p>
            <p><strong>Endereço:</strong> ${order.endereco}</p>
            <p><strong>Data:</strong> ${order.data}</p>
            <p><strong>Forma de Pagamento:</strong> ${order.pagamento}</p>
          </div>
          <div class="order-items">
            <h2>Itens do Pedido</h2>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qtd</th>
                  <th>Valor</th>
                  <th>Observação</th>
                </tr>
              </thead>
              <tbody>
                ${order.itens.map(item => `
                  <tr>
                    <td>${item.nome}</td>
                    <td>${item.quantidade}</td>
                    <td>${item.valor}</td>
                    <td>${item.observacao}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="order-total">
            <p><strong>Taxa de Entrega:</strong> ${order.taxaEntrega}</p>
            <p><strong>Total:</strong> ${order.total}</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    // Aguarda o carregamento do conteúdo
    printWindow.onload = function() {
      printWindow.print();
      // printWindow.close();
    };
  };

  return (
    <PageLayout 
      title="Gerenciar Pedidos"
      description="Visualize e gerencie todos os pedidos do seu estabelecimento."
      actions={
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Novo Pedido
        </Button>
      }
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente ou número do pedido..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="aguardando">Aguardando</SelectItem>
                <SelectItem value="preparando">Preparando</SelectItem>
                <SelectItem value="entregando">Entregando</SelectItem>
                <SelectItem value="entregue">Entregue</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.cliente}</TableCell>
                      <TableCell>{order.valor}</TableCell>
                      <TableCell>{order.data}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{order.endereco}</TableCell>
                      <TableCell>
                        <OrderStatusSelect 
                          orderId={order.id}
                          currentStatus={order.status}
                          onStatusChange={(status) => handleStatusChange(order.id, status)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Dropdown>
                            <DropdownTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownTrigger>
                            <DropdownContent align="end">
                              <DropdownItem onClick={() => {
                                setSelectedOrder(order);
                                setOrderDetailsOpen(true);
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar detalhes
                              </DropdownItem>
                              <DropdownItem onClick={() => handlePrintOrder(order)}>
                                <Printer className="mr-2 h-4 w-4" />
                                Imprimir pedido
                              </DropdownItem>
                            </DropdownContent>
                          </Dropdown>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Nenhum pedido encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          open={orderDetailsOpen}
          onOpenChange={setOrderDetailsOpen}
          onPrint={() => handlePrintOrder(selectedOrder)}
          onStatusChange={(status) => handleStatusChange(selectedOrder.id, status)}
        />
      )}
    </PageLayout>
  );
}
