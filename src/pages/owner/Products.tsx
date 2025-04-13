
import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, Filter, Edit, Trash2, ToggleLeft, ToggleRight, Star, Loader2
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
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ProductForm } from "@/components/products/ProductForm";
import { useMenu } from "@/hooks/useMenu";
import { formatCurrency } from "@/lib/formatters";

export default function OwnerProducts() {
  const { categories, products, isLoading, toggleProductStatus, toggleProductHighlight, removeProduct } = useMenu();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nome_produto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "todas" || product.categoria_id.toString() === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleToggleAvailability = async (product: any) => {
    const isAvailable = product.status !== "disponível";
    await toggleProductStatus(product.id, isAvailable);
  };

  const handleToggleFeatured = async (product: any) => {
    await toggleProductHighlight(product.id, !product.destaque);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleAddNewProduct = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    setDeletingId(id);
    await removeProduct(id);
    setDeletingId(null);
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.categoria : "Sem categoria";
  };

  if (isLoading) {
    return (
      <PageLayout 
        title="Gerenciar Produtos"
        description="Carregando produtos do seu estabelecimento..."
      >
        <div className="flex justify-center items-center p-16">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
        </div>
      </PageLayout>
    );
  }

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
                  <SelectItem key={category.id} value={category.id.toString()}>{category.categoria}</SelectItem>
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
                            src={product.foto || "/placeholder.svg"} 
                            alt={product.nome_produto} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        <span className="font-medium">{product.nome_produto}</span>
                      </TableCell>
                      <TableCell>{getCategoryName(product.categoria_id)}</TableCell>
                      <TableCell>{formatCurrency(product.preco)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleToggleAvailability(product)}
                          className={product.status === "disponível" ? "text-green-600" : "text-gray-400"}
                        >
                          {product.status === "disponível" ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleToggleFeatured(product)}
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
                            disabled={deletingId === product.id}
                          >
                            {deletingId === product.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
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
            categories={categories}
            onSuccess={() => {
              setIsDialogOpen(false);
              toast(
                selectedProduct ? "Produto atualizado" : "Produto criado",
                {
                  description: selectedProduct 
                    ? "O produto foi atualizado com sucesso." 
                    : "O produto foi criado com sucesso.",
                }
              );
            }} 
          />
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
