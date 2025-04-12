
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, Filter, Edit, Trash2, ToggleLeft, ToggleRight, Star, ImagePlus 
} from "lucide-react";
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
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ProductForm } from "@/components/products/ProductForm";

// Dados simulados para produtos
const products = [
  {
    id: 1,
    nome: "X-Tudo",
    categoria: "Hambúrgueres",
    valor: "R$ 28,90",
    disponivel: true,
    destaque: true,
    imagem: "/placeholder.svg"
  },
  {
    id: 2,
    nome: "X-Salada",
    categoria: "Hambúrgueres",
    valor: "R$ 22,90",
    disponivel: true,
    destaque: false,
    imagem: "/placeholder.svg"
  },
  {
    id: 3,
    nome: "Coca-Cola 350ml",
    categoria: "Bebidas",
    valor: "R$ 5,50",
    disponivel: true,
    destaque: false,
    imagem: "/placeholder.svg"
  },
  {
    id: 4,
    nome: "Batata Frita Grande",
    categoria: "Acompanhamentos",
    valor: "R$ 15,90",
    disponivel: false,
    destaque: false,
    imagem: "/placeholder.svg"
  },
  {
    id: 5,
    nome: "Pudim",
    categoria: "Sobremesas",
    valor: "R$ 12,50",
    disponivel: true,
    destaque: true,
    imagem: "/placeholder.svg"
  },
];

export default function OwnerProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { toast } = useToast();

  const categories = ["Hambúrgueres", "Bebidas", "Acompanhamentos", "Sobremesas"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "todas" || product.categoria === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleToggleAvailability = (productId: number) => {
    // Em um ambiente real, aqui faríamos uma chamada à API para atualizar o status
    toast({
      title: "Status alterado",
      description: "Disponibilidade do produto foi atualizada com sucesso.",
    });
  };

  const handleToggleFeatured = (productId: number) => {
    // Em um ambiente real, aqui faríamos uma chamada à API para atualizar o destaque
    toast({
      title: "Status alterado",
      description: "Destaque do produto foi atualizado com sucesso.",
    });
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleAddNewProduct = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (productId: number) => {
    // Em um ambiente real, aqui faríamos uma chamada à API para excluir o produto
    toast({
      title: "Produto excluído",
      description: "O produto foi removido com sucesso.",
      variant: "destructive",
    });
  };

  return (
    <PageLayout 
      title="Gerenciar Produtos"
      description="Cadastre e gerencie os produtos do seu estabelecimento."
      actions={
        <Button 
          size="sm" 
          className="bg-fomex-orange hover:bg-fomex-orange/90"
          onClick={handleAddNewProduct}
        >
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
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Disponível</TableHead>
                  <TableHead>Destaque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-muted/50">
                      <TableCell className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={product.imagem} 
                            alt={product.nome} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="font-medium">{product.nome}</span>
                      </TableCell>
                      <TableCell>{product.categoria}</TableCell>
                      <TableCell>{product.valor}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleToggleAvailability(product.id)}
                          className={product.disponivel ? "text-green-600" : "text-gray-400"}
                        >
                          {product.disponivel ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleToggleFeatured(product.id)}
                          className={product.destaque ? "text-amber-500" : "text-gray-400"}
                        >
                          <Star className="h-5 w-5" fill={product.destaque ? "currentColor" : "none"} />
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleEditProduct(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="text-destructive"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm 
            product={selectedProduct} 
            onSuccess={() => {
              setIsDialogOpen(false);
              toast({
                title: selectedProduct ? "Produto atualizado" : "Produto criado",
                description: selectedProduct 
                  ? "O produto foi atualizado com sucesso." 
                  : "O produto foi criado com sucesso.",
              });
            }} 
          />
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
