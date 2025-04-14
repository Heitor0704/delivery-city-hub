
import { useState, useEffect } from "react";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Category } from "./types";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, X, Search, Image, Plus } from "lucide-react";

// Sample products data - in a real app this would come from API/props
const sampleProducts = [
  { id: 1, name: "X-Tudo", category: "Hambúrgueres", price: "R$ 28,90" },
  { id: 2, name: "X-Salada", category: "Hambúrgueres", price: "R$ 22,90" },
  { id: 3, name: "Coca-Cola 350ml", category: "Bebidas", price: "R$ 5,50" },
  { id: 4, name: "Batata Frita Grande", category: "Acompanhamentos", price: "R$ 15,90" },
  { id: 5, name: "Pudim", category: "Sobremesas", price: "R$ 12,50" },
];

interface CategoryEditFormProps {
  category: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (category: Category) => void;
}

interface SelectedProduct {
  id: number;
  name: string;
  order: number;
}

export function CategoryEditForm({ 
  category, 
  open, 
  onOpenChange, 
  onSave 
}: CategoryEditFormProps) {
  const [editedCategory, setEditedCategory] = useState<Category>({...category});
  const [imagePreview, setImagePreview] = useState<string | null>(category.imagem || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const { toast } = useToast();
  
  // Initialize selected products from category (in a real app this would be loaded)
  useEffect(() => {
    // Mock data for demonstration - would be loaded from API in real app
    const mockSelectedProducts = category.id === 1 ? [
      { id: 1, name: "X-Tudo", order: 1 },
      { id: 2, name: "X-Salada", order: 2 },
    ] : [];
    
    setSelectedProducts(mockSelectedProducts);
  }, [category.id]);
  
  const handleChange = (field: string, value: any) => {
    setEditedCategory({...editedCategory, [field]: value});
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          const imageUrl = event.target.result as string;
          setImagePreview(imageUrl);
          handleChange("imagem", imageUrl);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = () => {
    if (!editedCategory.nome) {
      toast({
        title: "Campo obrigatório",
        description: "Nome da categoria é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    onSave(editedCategory);
    onOpenChange(false);
  };

  const handleAddProduct = (productId: number) => {
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return;
    
    if (selectedProducts.some(p => p.id === productId)) {
      // Already selected, remove it
      setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
      return;
    }
    
    // Find highest order
    const maxOrder = selectedProducts.length > 0 
      ? Math.max(...selectedProducts.map(p => p.order))
      : 0;
      
    setSelectedProducts([
      ...selectedProducts,
      { id: product.id, name: product.name, order: maxOrder + 1 }
    ]);
  };
  
  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };
  
  const moveProduct = (productId: number, direction: 'up' | 'down') => {
    const index = selectedProducts.findIndex(p => p.id === productId);
    if (index === -1) return;
    
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === selectedProducts.length - 1)) {
      return;
    }
    
    const newProducts = [...selectedProducts];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap orders
    const tempOrder = newProducts[index].order;
    newProducts[index].order = newProducts[swapIndex].order;
    newProducts[swapIndex].order = tempOrder;
    
    // Sort array by order to reflect the new arrangement
    newProducts.sort((a, b) => a.order - b.order);
    
    setSelectedProducts(newProducts);
  };

  // Filter products based on search term
  const filteredProducts = sampleProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
          <DialogDescription>
            Edite os detalhes da categoria {category.nome}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input 
              id="name" 
              value={editedCategory.nome} 
              onChange={(e) => handleChange("nome", e.target.value)}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <Input 
              id="description" 
              value={editedCategory.descricao} 
              onChange={(e) => handleChange("descricao", e.target.value)}
              className="col-span-3" 
            />
          </div>
          
          {/* Enhanced Image Upload with Preview */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="image" className="text-right pt-2">
              Imagem
            </Label>
            <div className="col-span-3">
              <div className="flex flex-col gap-2">
                {/* Image Preview Container */}
                <div 
                  className="border-2 border-dashed rounded-md p-2 flex items-center justify-center h-40 bg-gray-50"
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-full w-full object-contain" 
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/80" 
                        onClick={() => {
                          setImagePreview(null);
                          handleChange("imagem", "");
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <Image className="h-10 w-10 mb-2" />
                      <span className="text-sm">Adicione uma imagem</span>
                    </div>
                  )}
                </div>
                
                {/* Image Upload Input */}
                <div className="relative">
                  <Input 
                    id="image" 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Image className="h-4 w-4" />
                    Selecionar Imagem
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Selection Section */}
          <div className="grid grid-cols-1 gap-4 mt-4">
            <Label className="font-medium text-gray-700">
              Produtos nesta Categoria
            </Label>
            
            {/* Search Products */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Selected Products List */}
            {selectedProducts.length > 0 && (
              <div className="border rounded-md p-3 space-y-2">
                <Label className="text-sm text-gray-500">Produtos Selecionados:</Label>
                <div className="divide-y border rounded-md">
                  {selectedProducts
                    .sort((a, b) => a.order - b.order)
                    .map((product) => (
                      <div 
                        key={product.id} 
                        className="p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Badge className="mr-2 bg-orange-100 text-orange-800">
                            {product.order}
                          </Badge>
                          <span>{product.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            type="button"
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={() => moveProduct(product.id, 'up')}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            type="button"
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={() => moveProduct(product.id, 'down')}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button 
                            type="button"
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7 text-destructive" 
                            onClick={() => handleRemoveProduct(product.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {/* Available Products List */}
            <div className="border rounded-md p-3 space-y-2">
              <Label className="text-sm text-gray-500">
                Todos os Produtos {searchTerm ? `(Filtro: ${searchTerm})` : ''}:
              </Label>
              <div className="grid grid-cols-1 gap-2">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const isSelected = selectedProducts.some(p => p.id === product.id);
                    return (
                      <div
                        key={product.id}
                        onClick={() => handleAddProduct(product.id)}
                        className={`p-3 border rounded-md flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
                          isSelected ? "border-orange-300 bg-orange-50" : "border-gray-200"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-sm text-gray-500">{product.price}</span>
                        </div>
                        <Button
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className={isSelected ? "bg-orange-500 hover:bg-orange-600" : ""}
                        >
                          {isSelected ? "Selecionado" : "Selecionar"}
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Nenhum produto encontrado com esse termo.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="active" className="text-right">
              Ativo
            </Label>
            <div className="col-span-3 flex items-center">
              <Switch 
                id="active" 
                checked={editedCategory.ativo} 
                onCheckedChange={(checked) => handleChange("ativo", checked)} 
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
