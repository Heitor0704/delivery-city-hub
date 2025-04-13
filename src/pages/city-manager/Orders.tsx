
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye } from "lucide-react";
import { OrderStatusSelect } from "@/components/order/OrderStatusSelect";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Dados simulados de pedidos
const orders = [
  {
    id: "PED001",
    estabelecimento: "Burger King - Centro",
    cliente: "Carlos Silva",
    valor: 45.9,
    status: "aguardando",
    entregador: null,
    data: "2023-04-15T14:30:00",
    items: [
      { nome: "Whopper", quantidade: 2, valor: 19.90 },
      { nome: "Batata Grande", quantidade: 1, valor: 9.90 }
    ]
  },
  {
    id: "PED002",
    estabelecimento: "Pizza Hut - Shopping",
    cliente: "Ana Oliveira",
    valor: 89.9,
    status: "preparando",
    entregador: "Paulo Oliveira",
    data: "2023-04-15T14:15:00",
    items: [
      { nome: "Pizza Grande Calabresa", quantidade: 1, valor: 59.90 },
      { nome: "Refrigerante 2L", quantidade: 1, valor: 12.90 }
    ]
  },
  {
    id: "PED003",
    estabelecimento: "Sushi Express",
    cliente: "Mariana Santos",
    valor: 120.5,
    status: "entregando",
    entregador: "Roberto Almeida",
    data: "2023-04-15T13:50:00",
    items: [
      { nome: "Combo 40 peças", quantidade: 1, valor: 89.90 },
      { nome: "Temaki", quantidade: 2, valor: 15.90 }
    ]
  },
  {
    id: "PED004",
    estabelecimento: "Padaria São João",
    cliente: "Pedro Costa",
    valor: 27.8,
    status: "entregue",
    entregador: "Carlos Silva",
    data: "2023-04-15T12:30:00",
    items: [
      { nome: "Pão Francês", quantidade: 10, valor: 10.00 },
      { nome: "Bolo de Chocolate", quantidade: 1, valor: 17.80 }
    ]
  },
  {
    id: "PED005",
    estabelecimento: "China in Box",
    cliente: "Julia Mendes",
    valor: 75.4,
    status: "cancelado",
    entregador: null,
    data: "2023-04-15T11:45:00",
    items: [
      { nome: "Yakissoba", quantidade: 2, valor: 37.70 }
    ]
  },
];

// Lista de entregadores para atribuição
const deliverers = [
  { id: 1, nome: "Carlos Silva" },
  { id: 2, nome: "Marcelo Santos" },
  { id: 3, nome: "Paulo Oliveira" },
  { id: 4, nome: "Amanda Costa" },
  { id: 5, nome: "Roberto Almeida" },
];

export default function CityManagerOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [storeFilter, setStoreFilter] = useState("todos");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [viewOrderDetails, setViewOrderDetails] = useState(false);

  // Extrair lista de estabelecimentos únicos dos pedidos
  const stores = [...new Set(orders.map(order => order.estabelecimento))];
  
  const handleStatusChange = (orderId: string, newStatus: string) => {
    console.log(`Pedido ${orderId} atualizado para status: ${newStatus}`);
    // Aqui implementaríamos a atualização do status no backend
  };

  const handleDelivererAssign = (orderId: string, delivererId: string) => {
    console.log(`Entregador ${delivererId} atribuído ao pedido ${orderId}`);
    // Aqui implementaríamos a atribuição do entregador no backend
  };

  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setViewOrderDetails(true);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.estabelecimento.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || order.status === statusFilter;
    const matchesStore = storeFilter === "todos" || order.estabelecimento === storeFilter;
    
    return matchesSearch && matchesStatus && matchesStore;
  });

  return (
    <PageLayout 
      title="Gerenciar Pedidos"
      description="Visualize e gerencie os pedidos de todos os estabelecimentos da cidade."
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, estabelecimento ou cliente..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-2">
            <div className="flex items-center gap-2 min-w-[180px]">
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
            <div className="flex items-center gap-2 min-w-[180px]">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={storeFilter}
                onValueChange={setStoreFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por estabelecimento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos estabelecimentos</SelectItem>
                  {stores.map((store) => (
                    <SelectItem key={store} value={store}>{store}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Estabelecimento</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Entregador</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.estabelecimento}</TableCell>
                      <TableCell>{order.cliente}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(order.valor)}
                      </TableCell>
                      <TableCell>
                        <OrderStatusSelect 
                          orderId={order.id}
                          currentStatus={order.status}
                          onStatusChange={(status) => handleStatusChange(order.id, status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={order.entregador || ""}
                          onValueChange={(value) => handleDelivererAssign(order.id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Atribuir" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Selecionar...</SelectItem>
                            {deliverers.map((deliverer) => (
                              <SelectItem key={deliverer.id} value={deliverer.nome}>
                                {deliverer.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => openOrderDetails(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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

      {/* Modal de detalhes do pedido */}
      <Dialog open={viewOrderDetails} onOpenChange={setViewOrderDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estabelecimento</p>
                  <p>{selectedOrder.estabelecimento}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                  <p>{selectedOrder.cliente}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data/Hora</p>
                  <p>{new Date(selectedOrder.data).toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant="outline" 
                    className={
                      selectedOrder.status === "entregue" ? "bg-green-100 text-green-800" : 
                      selectedOrder.status === "cancelado" ? "bg-red-100 text-red-800" :
                      selectedOrder.status === "entregando" ? "bg-purple-100 text-purple-800" :
                      selectedOrder.status === "preparando" ? "bg-blue-100 text-blue-800" :
                      "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Itens do Pedido</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Qtd</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.nome}</TableCell>
                        <TableCell>{item.quantidade}</TableCell>
                        <TableCell className="text-right">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(item.valor * item.quantidade)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} className="text-right font-medium">Total</TableCell>
                      <TableCell className="text-right font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(selectedOrder.valor)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              {selectedOrder.entregador && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entregador</p>
                  <p>{selectedOrder.entregador}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
