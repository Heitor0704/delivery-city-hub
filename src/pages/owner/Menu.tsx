
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, AlertCircle } from "lucide-react";
import { CategoryList } from "@/components/menu/CategoryList";
import { AddonList } from "@/components/menu/AddonList";
import { MenuLevelList } from "@/components/menu/MenuLevelList";
import { MenuOptionList } from "@/components/menu/MenuOptionList";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function OwnerMenu() {
  const [activeTab, setActiveTab] = useState("categories");
  
  // State for add/edit dialogs
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddAddonOpen, setIsAddAddonOpen] = useState(false);
  const [isAddLevelOpen, setIsAddLevelOpen] = useState(false);
  const [isAddOptionOpen, setIsAddOptionOpen] = useState(false);
  
  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: string} | null>(null);
  
  // Form state
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    active: true
  });
  
  const [addonForm, setAddonForm] = useState({
    name: "",
    price: "",
    active: true
  });
  
  const [levelForm, setLevelForm] = useState({
    name: "",
    min: "0",
    max: "1",
    active: true
  });
  
  const [optionForm, setOptionForm] = useState({
    name: "",
    price: "",
    level: "",
    active: true
  });
  
  const { toast } = useToast();

  const handleAdd = (type: string) => {
    switch(type) {
      case "categories":
        setIsAddCategoryOpen(true);
        break;
      case "addons":
        setIsAddAddonOpen(true);
        break;
      case "levels":
        setIsAddLevelOpen(true);
        break;
      case "options":
        setIsAddOptionOpen(true);
        break;
    }
  };

  const handleDelete = (id: string, type: string) => {
    setItemToDelete({id, type});
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    
    // Here you would make API call to delete the item
    toast({
      title: "Item excluído",
      description: `O item foi excluído com sucesso.`,
    });
    
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };
  
  // Handlers for category form
  const handleCategoryChange = (field: string, value: any) => {
    setCategoryForm({...categoryForm, [field]: value});
  };
  
  const handleSaveCategory = () => {
    // Validate form
    if (!categoryForm.name) {
      toast({
        title: "Campo obrigatório",
        description: "Nome da categoria é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    // Save category (in a real app, this would be an API call)
    toast({
      title: "Categoria salva",
      description: "A categoria foi salva com sucesso.",
    });
    
    // Reset form and close dialog
    setCategoryForm({ name: "", description: "", active: true });
    setIsAddCategoryOpen(false);
  };
  
  // Handlers for addon form
  const handleAddonChange = (field: string, value: any) => {
    setAddonForm({...addonForm, [field]: value});
  };
  
  const handleSaveAddon = () => {
    // Validate form
    if (!addonForm.name || !addonForm.price) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e preço são obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Adicional salvo",
      description: "O adicional foi salvo com sucesso.",
    });
    
    // Reset form and close dialog
    setAddonForm({ name: "", price: "", active: true });
    setIsAddAddonOpen(false);
  };
  
  // Handlers for level form
  const handleLevelChange = (field: string, value: any) => {
    setLevelForm({...levelForm, [field]: value});
  };
  
  const handleSaveLevel = () => {
    // Validate form
    if (!levelForm.name) {
      toast({
        title: "Campo obrigatório",
        description: "Nome do nível é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    if (Number(levelForm.min) > Number(levelForm.max)) {
      toast({
        title: "Valores inválidos",
        description: "O mínimo não pode ser maior que o máximo",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Nível salvo",
      description: "O nível foi salvo com sucesso.",
    });
    
    // Reset form and close dialog
    setLevelForm({ name: "", min: "0", max: "1", active: true });
    setIsAddLevelOpen(false);
  };
  
  // Handlers for option form
  const handleOptionChange = (field: string, value: any) => {
    setOptionForm({...optionForm, [field]: value});
  };
  
  const handleSaveOption = () => {
    // Validate form
    if (!optionForm.name || !optionForm.level) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e nível são obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Opção salva",
      description: "A opção foi salva com sucesso.",
    });
    
    // Reset form and close dialog
    setOptionForm({ name: "", price: "", level: "", active: true });
    setIsAddOptionOpen(false);
  };

  return (
    <PageLayout 
      title="Gerenciar Cardápio"
      description="Crie e gerencie as categorias e itens do seu cardápio."
      actions={
        <>
          {activeTab === "categories" && (
            <Button size="sm" className="bg-fomex-orange hover:bg-fomex-orange/90" onClick={() => handleAdd("categories")}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          )}
          {activeTab === "addons" && (
            <Button size="sm" className="bg-fomex-orange hover:bg-fomex-orange/90" onClick={() => handleAdd("addons")}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Adicional
            </Button>
          )}
          {activeTab === "levels" && (
            <Button size="sm" className="bg-fomex-orange hover:bg-fomex-orange/90" onClick={() => handleAdd("levels")}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Nível
            </Button>
          )}
          {activeTab === "options" && (
            <Button size="sm" className="bg-fomex-orange hover:bg-fomex-orange/90" onClick={() => handleAdd("options")}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Opção
            </Button>
          )}
        </>
      }
    >
      <Tabs defaultValue="categories" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="categories" className="flex-1 md:flex-none">Categorias</TabsTrigger>
          <TabsTrigger value="addons" className="flex-1 md:flex-none">Adicionais</TabsTrigger>
          <TabsTrigger value="levels" className="flex-1 md:flex-none">Níveis</TabsTrigger>
          <TabsTrigger value="options" className="flex-1 md:flex-none">Opções</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <CategoryList onDelete={(id) => handleDelete(id, 'category')} />
        </TabsContent>
        
        <TabsContent value="addons">
          <AddonList onDelete={(id) => handleDelete(id, 'addon')} />
        </TabsContent>
        
        <TabsContent value="levels">
          <MenuLevelList onDelete={(id) => handleDelete(id, 'level')} />
        </TabsContent>
        
        <TabsContent value="options">
          <MenuOptionList onDelete={(id) => handleDelete(id, 'option')} />
        </TabsContent>
      </Tabs>

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Categoria</DialogTitle>
            <DialogDescription>
              Crie uma nova categoria para o seu cardápio.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input 
                id="name" 
                placeholder="Nome da categoria" 
                value={categoryForm.name}
                onChange={(e) => handleCategoryChange("name", e.target.value)}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Textarea 
                id="description" 
                placeholder="Descrição (opcional)"
                value={categoryForm.description}
                onChange={(e) => handleCategoryChange("description", e.target.value)}
                className="col-span-3" 
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Imagem
              </Label>
              <Input id="image" type="file" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">
                Ativo
              </Label>
              <div className="col-span-3 flex items-center">
                <Switch 
                  id="active" 
                  checked={categoryForm.active}
                  onCheckedChange={(checked) => handleCategoryChange("active", checked)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveCategory}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Addon Dialog */}
      <Dialog open={isAddAddonOpen} onOpenChange={setIsAddAddonOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Adicional</DialogTitle>
            <DialogDescription>
              Crie um novo adicional para seus produtos.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="addon-name" className="text-right">
                Nome
              </Label>
              <Input 
                id="addon-name" 
                placeholder="Nome do adicional" 
                value={addonForm.name}
                onChange={(e) => handleAddonChange("name", e.target.value)}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="addon-price" className="text-right">
                Preço (R$)
              </Label>
              <Input 
                id="addon-price" 
                type="text" 
                placeholder="0.00" 
                value={addonForm.price}
                onChange={(e) => handleAddonChange("price", e.target.value)}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="addon-active" className="text-right">
                Ativo
              </Label>
              <div className="col-span-3 flex items-center">
                <Switch 
                  id="addon-active" 
                  checked={addonForm.active}
                  onCheckedChange={(checked) => handleAddonChange("active", checked)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAddonOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveAddon}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Level Dialog */}
      <Dialog open={isAddLevelOpen} onOpenChange={setIsAddLevelOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nível</DialogTitle>
            <DialogDescription>
              Crie um novo nível para personalizar seus produtos.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level-name" className="text-right">
                Nome
              </Label>
              <Input 
                id="level-name" 
                placeholder="Nome do nível" 
                value={levelForm.name}
                onChange={(e) => handleLevelChange("name", e.target.value)}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level-min" className="text-right">
                Mínimo
              </Label>
              <Input 
                id="level-min" 
                type="number" 
                min="0"
                placeholder="0" 
                value={levelForm.min}
                onChange={(e) => handleLevelChange("min", e.target.value)}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level-max" className="text-right">
                Máximo
              </Label>
              <Input 
                id="level-max" 
                type="number" 
                min="1"
                placeholder="1" 
                value={levelForm.max}
                onChange={(e) => handleLevelChange("max", e.target.value)}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level-active" className="text-right">
                Ativo
              </Label>
              <div className="col-span-3 flex items-center">
                <Switch 
                  id="level-active" 
                  checked={levelForm.active}
                  onCheckedChange={(checked) => handleLevelChange("active", checked)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddLevelOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveLevel}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Option Dialog */}
      <Dialog open={isAddOptionOpen} onOpenChange={setIsAddOptionOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Opção</DialogTitle>
            <DialogDescription>
              Crie uma nova opção para seus produtos.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="option-name" className="text-right">
                Nome
              </Label>
              <Input 
                id="option-name" 
                placeholder="Nome da opção"
                value={optionForm.name}
                onChange={(e) => handleOptionChange("name", e.target.value)}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="option-price" className="text-right">
                Preço adicional (R$)
              </Label>
              <Input 
                id="option-price" 
                type="text" 
                placeholder="0.00" 
                value={optionForm.price}
                onChange={(e) => handleOptionChange("price", e.target.value)}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="option-level" className="text-right">
                Nível
              </Label>
              <div className="col-span-3">
                <Select
                  value={optionForm.level}
                  onValueChange={(value) => handleOptionChange("level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Proteína">Proteína</SelectItem>
                    <SelectItem value="Tamanho">Tamanho</SelectItem>
                    <SelectItem value="Ponto da Carne">Ponto da Carne</SelectItem>
                    <SelectItem value="Acompanhamentos">Acompanhamentos</SelectItem>
                    <SelectItem value="Molhos">Molhos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="option-active" className="text-right">
                Ativo
              </Label>
              <div className="col-span-3 flex items-center">
                <Switch 
                  id="option-active"
                  checked={optionForm.active}
                  onCheckedChange={(checked) => handleOptionChange("active", checked)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOptionOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveOption}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente este item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
}
