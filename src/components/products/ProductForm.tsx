
import { useState } from "react";
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
import { ImagePlus, X, Trash } from "lucide-react";

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

  const [selectedLevels, setSelectedLevels] = useState<string[]>(product?.levels || []);
  const [activeTab, setActiveTab] = useState("basic");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value === "sim" }));
  };

  const handleSelectedLevelsChange = (levelId: string) => {
    if (selectedLevels.includes(levelId)) {
      setSelectedLevels(selectedLevels.filter(l => l !== levelId));
    } else {
      setSelectedLevels([...selectedLevels, levelId]);
    }
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
    // Em um ambiente real, aqui faríamos uma chamada à API
    console.log("Form submitted with data:", { ...formData, levels: selectedLevels });
    onSuccess();
  };

  const getLevelById = (id: string) => {
    return menuLevels.find(level => level.id === id);
  };

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
              Níveis de Opções
            </Label>
            
            <div className="grid grid-cols-1 gap-4 mt-2">
              {selectedLevels.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedLevels.map((levelId) => {
                    const level = getLevelById(levelId);
                    return (
                      <Badge 
                        key={levelId} 
                        className="bg-orange-100 text-orange-800 hover:bg-orange-200 px-3 py-1 rounded-full flex items-center"
                      >
                        {level?.name || levelId}
                        <button 
                          type="button" 
                          className="ml-2 focus:outline-none" 
                          onClick={() => handleSelectedLevelsChange(levelId)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            
              {menuLevels.map((level) => (
                <div 
                  key={level.id} 
                  className={`p-4 border rounded-md cursor-pointer flex items-center justify-between ${
                    selectedLevels.includes(level.id) 
                      ? "border-fomex-orange bg-amber-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleSelectedLevelsChange(level.id)}
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
                  <div>
                    <input 
                      type="checkbox" 
                      checked={selectedLevels.includes(level.id)}
                      onChange={() => {}}
                      className="form-checkbox h-5 w-5 text-orange-500 rounded focus:ring-orange-500"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-sm text-muted-foreground mt-2">
              Selecione os níveis de personalização que se aplicam a este produto.
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
