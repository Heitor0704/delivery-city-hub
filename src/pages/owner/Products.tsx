
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
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

const products = [
  {
    id: 1,
    nome: "X-Tudo",
    categoria: "Hambúrgueres",
    valor: "R$ 28,90",
    disponivel: true,
    destaque: true,
  },
  {
    id: 2,
    nome: "X-Salada",
    categoria: "Hambúrgueres",
    valor: "R$ 22,90",
    disponivel: true,
    destaque: false,
  },
  {
    id: 3,
    nome: "Coca-Cola 350ml",
    categoria: "Bebidas",
    valor: "R$ 5,50",
    disponivel: true,
    destaque: false,
  },
  {
    id: 4,
    nome: "Batata Frita Grande",
    categoria: "Acompanhamentos",
    valor: "R$ 15,90",
    disponivel: false,
    destaque: false,
  },
  {
    id: 5,
    nome: "Pudim",
    categoria: "Sobremesas",
    valor: "R$ 12,50",
    disponivel: true,
    destaque: true,
  },
];

export default function OwnerProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");

  const categories = ["Hambúrgueres", "Bebidas", "Acompanhamentos", "Sobremesas"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "todas" || product.categoria === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <PageLayout 
      title="Gerenciar Produtos"
      description="Cadastre e gerencie os produtos do seu estabelecimento."
      actions={
        <Button size="sm" className="bg-fomex-orange hover:bg-fomex-orange/90">
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      }
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
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
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Destaque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{product.nome}</TableCell>
                      <TableCell>{product.categoria}</TableCell>
                      <TableCell>{product.valor}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={product.disponivel ? 
                          "bg-green-100 text-green-800 hover:bg-green-100" : 
                          "bg-red-100 text-red-800 hover:bg-red-100"
                        }>
                          {product.disponivel ? "Disponível" : "Indisponível"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {product.destaque && (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                            Destaque
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Nenhum produto encontrado.
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
