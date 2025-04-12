
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ImagePlus } from "lucide-react";

interface ProductFormProps {
  product?: any;
  onSuccess: () => void;
}

const categories = ["Hambúrgueres", "Bebidas", "Acompanhamentos", "Sobremesas"];
const menuLevels = ["Tamanho", "Ponto da Carne", "Molhos"];

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState({
    nome: product?.nome || "",
    descricao: product?.descricao || "",
    categoria: product?.categoria || categories[0],
    valor: product?.valor?.replace("R$ ", "") || "",
    disponivel: product?.disponivel ?? true,
    destaque: product?.destaque ?? false,
    imagem: product?.imagem || "/placeholder.svg",
  });

  const [selectedLevels, setSelectedLevels] = useState<string[]>(product?.levels || []);
  const [activeTab, setActiveTab] = useState("basic");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectedLevelsChange = (level: string) => {
    if (selectedLevels.includes(level)) {
      setSelectedLevels(selectedLevels.filter(l => l !== level));
    } else {
      setSelectedLevels([...selectedLevels, level]);
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
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="options">Opções e Variações</TabsTrigger>
          <TabsTrigger value="image">Imagem</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Produto</Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}
              >
                <SelectTrigger id="categoria">
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
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                name="valor"
                value={formData.valor}
                onChange={handleInputChange}
                placeholder="0,00"
                required
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 pt-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="disponivel"
                checked={formData.disponivel}
                onCheckedChange={(checked) => handleSwitchChange("disponivel", checked)}
              />
              <Label htmlFor="disponivel">Disponível para venda</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="destaque"
                checked={formData.destaque}
                onCheckedChange={(checked) => handleSwitchChange("destaque", checked)}
              />
              <Label htmlFor="destaque">Produto em destaque</Label>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="options" className="space-y-4">
          <div className="space-y-4">
            <Label>Níveis de Opções</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {menuLevels.map((level) => (
                <div 
                  key={level} 
                  className={`p-3 border rounded-md cursor-pointer ${
                    selectedLevels.includes(level) 
                      ? "border-fomex-orange bg-amber-50" 
                      : "border-gray-200"
                  }`}
                  onClick={() => handleSelectedLevelsChange(level)}
                >
                  <div className="font-medium">{level}</div>
                  <div className="text-sm text-gray-500">
                    {level === "Tamanho" && "Pequeno, Médio, Grande"}
                    {level === "Ponto da Carne" && "Mal passado, Ao ponto, Bem passado"}
                    {level === "Molhos" && "Barbecue, Mostarda e Mel, etc"}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-sm text-muted-foreground">
              Selecione os níveis de opções que se aplicam a este produto.
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="image" className="space-y-4">
          <div className="space-y-4">
            <Label>Imagem do Produto</Label>
            <div className="flex justify-center">
              <div className="relative h-64 w-64 border-2 border-dashed border-gray-300 rounded-md overflow-hidden flex items-center justify-center">
                {formData.imagem ? (
                  <img 
                    src={formData.imagem} 
                    alt="Preview" 
                    className="h-full w-full object-contain"
                  />
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
      
      <DialogFooter className="mt-6">
        <div className="flex gap-2 w-full justify-end">
          <Button type="submit" className="bg-fomex-orange hover:bg-fomex-orange/90">
            {product ? "Salvar Alterações" : "Criar Produto"}
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}
