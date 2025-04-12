
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Eye, Star } from "lucide-react";
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

const deliverers = [
  {
    id: 1,
    nome: "Carlos Silva",
    telefone: "(11) 99999-8888",
    avaliacao: 4.8,
    status: "ativo",
    veículo: "Moto",
  },
  {
    id: 2,
    nome: "Marcelo Santos",
    telefone: "(11) 97777-6666",
    avaliacao: 4.5,
    status: "ativo",
    veículo: "Bicicleta",
  },
  {
    id: 3,
    nome: "Paulo Oliveira",
    telefone: "(11) 96666-5555",
    avaliacao: 4.7,
    status: "inativo",
    veículo: "Moto",
  },
  {
    id: 4,
    nome: "Amanda Costa",
    telefone: "(11) 95555-4444",
    avaliacao: 4.9,
    status: "pendente",
    veículo: "Carro",
  },
  {
    id: 5,
    nome: "Roberto Almeida",
    telefone: "(11) 94444-3333",
    avaliacao: 4.2,
    status: "ativo",
    veículo: "Moto",
  },
];

const statusColors: Record<string, string> = {
  ativo: "bg-green-100 text-green-800 hover:bg-green-100",
  inativo: "bg-red-100 text-red-800 hover:bg-red-100",
  pendente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
};

export default function CityManagerDeliverers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [vehicleFilter, setVehicleFilter] = useState("todos");

  const vehicles = ["Moto", "Bicicleta", "Carro"];

  const filteredDeliverers = deliverers.filter((deliverer) => {
    const matchesSearch = deliverer.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deliverer.telefone.includes(searchTerm);
    const matchesStatus = statusFilter === "todos" || deliverer.status === statusFilter;
    const matchesVehicle = vehicleFilter === "todos" || deliverer.veículo === vehicleFilter;
    
    return matchesSearch && matchesStatus && matchesVehicle;
  });

  return (
    <PageLayout 
      title="Gerenciar Entregadores"
      description="Visualize e gerencie os entregadores da sua cidade."
      actions={
        <Button size="sm" className="bg-fomex-orange hover:bg-fomex-orange/90">
          <Plus className="mr-2 h-4 w-4" />
          Novo Entregador
        </Button>
      }
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar entregadores por nome ou telefone..."
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
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 min-w-[180px]">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={vehicleFilter}
                onValueChange={setVehicleFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por veículo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os veículos</SelectItem>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle} value={vehicle}>{vehicle}</SelectItem>
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
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliverers.length > 0 ? (
                  filteredDeliverers.map((deliverer) => (
                    <TableRow key={deliverer.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{deliverer.nome}</TableCell>
                      <TableCell>{deliverer.telefone}</TableCell>
                      <TableCell>{deliverer.veículo}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          {deliverer.avaliacao}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[deliverer.status]}>
                          {deliverer.status.charAt(0).toUpperCase() + deliverer.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Nenhum entregador encontrado.
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
