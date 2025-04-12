
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Star, Eye } from "lucide-react";
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

const stores = [
  {
    id: 1,
    nome: "Burger King - Centro",
    categoria: "Hambúrgueres",
    avaliacao: 4.8,
    status: "aprovado",
    destaque: true,
  },
  {
    id: 2,
    nome: "Pizza Hut - Shopping",
    categoria: "Pizzas",
    avaliacao: 4.5,
    status: "aprovado",
    destaque: false,
  },
  {
    id: 3,
    nome: "Sushi Express",
    categoria: "Japonesa",
    avaliacao: 4.7,
    status: "aprovado",
    destaque: true,
  },
  {
    id: 4,
    nome: "Padaria São João",
    categoria: "Padarias",
    avaliacao: 4.2,
    status: "pendente",
    destaque: false,
  },
  {
    id: 5,
    nome: "China in Box",
    categoria: "Chinesa",
    avaliacao: 4.0,
    status: "rejeitado",
    destaque: false,
  },
];

const statusColors: Record<string, string> = {
  aprovado: "bg-green-100 text-green-800 hover:bg-green-100",
  pendente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  rejeitado: "bg-red-100 text-red-800 hover:bg-red-100",
};

export default function CityManagerStores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [statusFilter, setStatusFilter] = useState("todos");

  const categories = ["Hambúrgueres", "Pizzas", "Japonesa", "Padarias", "Chinesa"];

  const filteredStores = stores.filter((store) => {
    const matchesSearch = store.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "todas" || store.categoria === categoryFilter;
    const matchesStatus = statusFilter === "todos" || store.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <PageLayout 
      title="Gerenciar Estabelecimentos"
      description="Visualize e aprove os estabelecimentos da sua cidade."
      actions={
        <Button size="sm" className="bg-fomex-orange hover:bg-fomex-orange/90">
          <Plus className="mr-2 h-4 w-4" />
          Novo Estabelecimento
        </Button>
      }
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar estabelecimentos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-2">
            <div className="flex items-center gap-2 min-w-[180px]">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="rejeitado">Rejeitado</SelectItem>
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
                  <TableHead>Estabelecimento</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Destaque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStores.length > 0 ? (
                  filteredStores.map((store) => (
                    <TableRow key={store.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{store.nome}</TableCell>
                      <TableCell>{store.categoria}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          {store.avaliacao}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[store.status]}>
                          {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {store.destaque && (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                            Destaque
                          </Badge>
                        )}
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
                      Nenhum estabelecimento encontrado.
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
