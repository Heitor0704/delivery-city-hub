
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
import { Plus, Search, Filter } from "lucide-react";

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
  },
  {
    id: "#PED-1235",
    cliente: "Maria Souza",
    valor: "R$ 32,50",
    data: "12/04/2023 14:20",
    status: "preparando",
    endereco: "Av. Principal, 456",
  },
  {
    id: "#PED-1236",
    cliente: "Pedro Almeida",
    valor: "R$ 78,90",
    data: "12/04/2023 14:05",
    status: "entregando",
    endereco: "Rua das Árvores, 789",
  },
  {
    id: "#PED-1237",
    cliente: "Ana Costa",
    valor: "R$ 45,00",
    data: "12/04/2023 13:50",
    status: "entregue",
    endereco: "Rua da Praça, 101",
  },
  {
    id: "#PED-1238",
    cliente: "Carlos Mendes",
    valor: "R$ 27,80",
    data: "12/04/2023 13:45",
    status: "cancelado",
    endereco: "Av. Central, 202",
  },
];

export default function OwnerOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "todos" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.cliente}</TableCell>
                      <TableCell>{order.valor}</TableCell>
                      <TableCell>{order.data}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{order.endereco}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[order.status]}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Nenhum pedido encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
