
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Eye, UserCheck, Store } from "lucide-react";
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

const cities = [
  {
    id: 1,
    nome: "São Paulo",
    estado: "SP",
    totalEstabelecimentos: 125,
    totalEntregadores: 380,
    status: "ativo",
    gerente: "Ana Silva",
  },
  {
    id: 2,
    nome: "Rio de Janeiro",
    estado: "RJ",
    totalEstabelecimentos: 98,
    totalEntregadores: 250,
    status: "ativo",
    gerente: "João Santos",
  },
  {
    id: 3,
    nome: "Belo Horizonte",
    estado: "MG",
    totalEstabelecimentos: 65,
    totalEntregadores: 180,
    status: "ativo",
    gerente: "Carlos Mendes",
  },
  {
    id: 4,
    nome: "Curitiba",
    estado: "PR",
    totalEstabelecimentos: 42,
    totalEntregadores: 120,
    status: "inativo",
    gerente: "Paula Ferreira",
  },
  {
    id: 5,
    nome: "Salvador",
    estado: "BA",
    totalEstabelecimentos: 58,
    totalEntregadores: 150,
    status: "ativo",
    gerente: "Roberto Costa",
  },
];

const statusColors: Record<string, string> = {
  ativo: "bg-green-100 text-green-800 hover:bg-green-100",
  inativo: "bg-red-100 text-red-800 hover:bg-red-100",
  pendente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
};

export default function AdminCities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [stateFilter, setStateFilter] = useState("todos");

  const states = ["SP", "RJ", "MG", "PR", "BA"];

  const filteredCities = cities.filter((city) => {
    const matchesSearch = city.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         city.gerente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || city.status === statusFilter;
    const matchesState = stateFilter === "todos" || city.estado === stateFilter;
    
    return matchesSearch && matchesStatus && matchesState;
  });

  return (
    <PageLayout 
      title="Gerenciar Cidades"
      description="Visualize e gerencie as cidades onde o FomeX está operando."
      actions={
        <Button size="sm" className="bg-fomex-orange hover:bg-fomex-orange/90">
          <Plus className="mr-2 h-4 w-4" />
          Nova Cidade
        </Button>
      }
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cidades por nome ou gerente..."
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
                value={stateFilter}
                onValueChange={setStateFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os estados</SelectItem>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
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
                  <TableHead>Cidade</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Gerente</TableHead>
                  <TableHead>Estabelecimentos</TableHead>
                  <TableHead>Entregadores</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <TableRow key={city.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{city.nome}</TableCell>
                      <TableCell>{city.estado}</TableCell>
                      <TableCell>{city.gerente}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Store className="h-4 w-4 mr-1 text-fomex-orange" />
                          {city.totalEstabelecimentos}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <UserCheck className="h-4 w-4 mr-1 text-fomex-orange" />
                          {city.totalEntregadores}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[city.status]}>
                          {city.status.charAt(0).toUpperCase() + city.status.slice(1)}
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
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Nenhuma cidade encontrada.
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
