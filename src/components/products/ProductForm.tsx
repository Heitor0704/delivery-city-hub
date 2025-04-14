
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ImagePlus, X, Trash, ChevronUp, ChevronDown, Check, Search } from "lucide-react";

interface ProductFormProps {
  product?: any;
  onSuccess: () => void;
}

const categories = ["Hambúrgueres", "Bebidas", "Acompanhamentos", "Sobremesas"];
const menuLevels = [
  { id: "1", name: "Tamanho" },
  { id: "2", name: "Ponto da Carne" }, 
  { id: "3", name: "Molhos" },
  { id: "4", name: "Escolha um arroz" },
  { id: "5", name: "Escolha um feijão" },
];

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState({
    nome: product?.nome || "",
    descricao: product?.descricao || "",
    categoria: product?.categoria || categories[0],
    valor: product?.valor?.replace("R$ ", "") || "",
    disponivel: product?.disponivel ?? true,
    destaque: product?.destaque ?? false,
    imagem: product?.imagem || "/placeholder.svg",
    estoque: product?.estoque || "9999",
    ordem: product?.ordem || "1",
  });

  const [selectedLevels, setSelectedLevels] = useState<{id: string, name: string, order: number}[]>(
    product?.levels ? product.levels.map((lvl: string, idx: number) => {
      const level = menuLevels.find(l => l.id === lvl);
      return {
        id: lvl,
        name: level?.name || `Level ${lvl}`,
        order: idx + 1
      };
    }) : []
  );
  
  const [activeTab, setActiveTab] = useState("basic");
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value === "sim" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({ ...prev, imagem: event.target.result as string }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real environment, we would make an API call
    console.log("Form submitted with data:", { 
      ...formData, 
      levels: selectedLevels.map(level => level.id).sort((a, b) => 
        selectedLevels.find(l => l.id === a)!.order - selectedLevels.find(l => l.id === b)!.order
      ) 
    });
    onSuccess();
  };

  const handleAddLevel = (levelId: string) => {
    // Check if level is already selected
    if (selectedLevels.some(level => level.id === levelId)) {
      return;
    }

    const level = menuLevels.find(level => level.id === levelId);
    if (level) {
      const maxOrder = selectedLevels.length > 0 
        ? Math.max(...selectedLevels.map(l => l.order))
        : 0;
      
      setSelectedLevels([
        ...selectedLevels,
        { id: level.id, name: level.name, order: maxOrder + 1 }
      ]);
    }
  };

  const handleRemoveLevel = (levelId: string) => {
    setSelectedLevels(selectedLevels.filter(level => level.id !== levelId));
  };

  const moveLevel = (levelId: string, direction: 'up' | 'down') => {
    const index = selectedLevels.findIndex(level => level.id === levelId);
    if (index === -1) return;
    
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === selectedLevels.length - 1)) {
      return;
    }
    
    const newLevels = [...selectedLevels];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap orders
    const tempOrder = newLevels[index].order;
    newLevels[index].order = newLevels[swapIndex].order;
    newLevels[swapIndex].order = tempOrder;
    
    // Swap positions in array to reflect the new order
    [newLevels[index], newLevels[swapIndex]] = [newLevels[swapIndex], newLevels[index]];
    
    setSelectedLevels(newLevels);
  };

  // Filter levels based on search term
  const filteredLevels = menuLevels.filter(level =>
    level.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="options">Opções e Níveis</TabsTrigger>
          <TabsTrigger value="image">Imagem</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="font-medium text-gray-700">
                Nome do Produto:
              </Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Nome do produto"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoria" className="font-medium text-gray-700">
                Categoria:
              </Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}
              >
                <SelectTrigger id="categoria" className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valor" className="font-medium text-gray-700">
                Valor (R$):
              </Label>
              <Input
                id="valor"
                name="valor"
                value={formData.valor}
                onChange={handleInputChange}
                placeholder="0,00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estoque" className="font-medium text-gray-700">
                Estoque: <span className="text-xs text-orange-500">(Para ataque on-demand ou digital: 9999)</span>
              </Label>
              <Input
                id="estoque"
                name="estoque"
                value={formData.estoque}
                onChange={handleInputChange}
                placeholder="9999"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ordem" className="font-medium text-gray-700">
                Ordem: <span className="text-xs text-gray-500">(Serão mostrados em ordem crescente)</span>
              </Label>
              <Input
                id="ordem"
                name="ordem"
                type="number"
                min="1"
                value={formData.ordem}
                onChange={handleInputChange}
                placeholder="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descricao" className="font-medium text-gray-700">
                Descrição:
              </Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                rows={5}
                placeholder="Descreva o produto..."
              />
            </div>
            
            <div className="space-y-2">
              <Label className="font-medium text-gray-700">Ativo?</Label>
              <RadioGroup
                value={formData.disponivel ? "sim" : "nao"}
                onValueChange={(value) => handleRadioChange("disponivel", value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="active-yes" />
                  <Label htmlFor="active-yes">Ativo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="active-no" />
                  <Label htmlFor="active-no">Inativo</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="options" className="space-y-6">
          <div className="space-y-4">
            <Label className="font-medium text-gray-700 block text-lg">
              Níveis de Opções do Produto
            </Label>
            
            <div className="flex flex-col space-y-4">
              {/* Search and filter section */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar níveis..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Selected levels section */}
              {selectedLevels.length > 0 && (
                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">Níveis Selecionados:</Label>
                  <div className="border rounded-md divide-y">
                    {selectedLevels
                      .sort((a, b) => a.order - b.order)
                      .map((level) => (
                        <div 
                          key={level.id} 
                          className="p-3 flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <Badge className="mr-2 bg-orange-100 text-orange-800">
                              {level.order}
                            </Badge>
                            <span>{level.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              type="button"
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7" 
                              onClick={() => moveLevel(level.id, 'up')}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button 
                              type="button"
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7" 
                              onClick={() => moveLevel(level.id, 'down')}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button 
                              type="button"
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7 text-destructive" 
                              onClick={() => handleRemoveLevel(level.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              
              {/* Available levels section */}
              <div className="space-y-2">
                <Label className="font-medium text-gray-700">Níveis Disponíveis:</Label>
                <div className="grid grid-cols-1 gap-4 mt-2">
                  {filteredLevels.length > 0 ? (
                    filteredLevels.map((level) => (
                      <div
                        key={level.id}
                        className={`p-4 border rounded-md flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
                          selectedLevels.some(l => l.id === level.id) 
                            ? "border-orange-300 bg-orange-50" 
                            : "border-gray-200"
                        }`}
                        onClick={() => {
                          if (selectedLevels.some(l => l.id === level.id)) {
                            handleRemoveLevel(level.id);
                          } else {
                            handleAddLevel(level.id);
                          }
                        }}
                      >
                        <div>
                          <div className="font-medium">{level.name}</div>
                          <div className="text-sm text-gray-500">
                            {level.name === "Tamanho" && "Pequeno, Médio, Grande"}
                            {level.name === "Ponto da Carne" && "Mal passado, Ao ponto, Bem passado"}
                            {level.name === "Molhos" && "Barbecue, Mostarda e Mel, etc"}
                            {level.name === "Escolha um arroz" && "Branco, Integral, Sem arroz"}
                            {level.name === "Escolha um feijão" && "Preto, Carioca, Sem feijão"}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {selectedLevels.some(l => l.id === level.id) ? (
                            <Check className="h-5 w-5 text-orange-500" />
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddLevel(level.id);
                              }}
                            >
                              Selecionar
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-4 text-muted-foreground">
                      Nenhum nível encontrado com essa busca.
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground mt-2">
              Selecione os níveis de personalização que se aplicam a este produto.
              Use os botões para reordenar os níveis selecionados.
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="image" className="space-y-4">
          <div className="space-y-4">
            <Label className="font-medium text-gray-700 block text-lg">
              Imagem do Produto
            </Label>
            
            <div className="flex justify-center">
              <div className="relative h-64 w-64 border-2 border-dashed border-gray-300 rounded-md overflow-hidden flex items-center justify-center">
                {formData.imagem ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={formData.imagem} 
                      alt="Preview" 
                      className="h-full w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, imagem: "" }))}
                      className="absolute top-2 right-2 bg-white/80 rounded-full p-1 focus:outline-none"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2 text-sm text-gray-500">
                      Clique ou arraste uma imagem
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground text-center">
              Tamanho recomendado: 800x800 pixels. Formatos aceitos: JPG, PNG, GIF.
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <DialogFooter className="mt-6 flex justify-between">
        {product && (
          <Button type="button" variant="destructive" className="flex items-center">
            <Trash className="mr-2 h-4 w-4" />
            Excluir Produto
          </Button>
        )}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => onSuccess()} className="border-gray-300">
            Cancelar
          </Button>
          <Button type="submit" className="bg-fomex-orange hover:bg-fomex-orange/90">
            {product ? "Editar Produto" : "Salvar"}
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}
