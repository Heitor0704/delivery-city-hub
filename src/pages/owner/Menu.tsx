
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetFooter, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, AlertCircle } from "lucide-react";
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

  const handleEdit = (id: string, type: string) => {
    console.log(`Edit ${type} with ID: ${id}`);
    // Implement edit functionality here
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
  
  const handleSaveCategory = (data: any) => {
    // Here you would save the category data
    toast({
      title: "Categoria salva",
      description: "A categoria foi salva com sucesso.",
    });
    setIsAddCategoryOpen(false);
  };
  
  const handleSaveAddon = (data: any) => {
    toast({
      title: "Adicional salvo",
      description: "O adicional foi salvo com sucesso.",
    });
    setIsAddAddonOpen(false);
  };
  
  const handleSaveLevel = (data: any) => {
    toast({
      title: "Nível salvo",
      description: "O nível foi salvo com sucesso.",
    });
    setIsAddLevelOpen(false);
  };
  
  const handleSaveOption = (data: any) => {
    toast({
      title: "Opção salva",
      description: "A opção foi salva com sucesso.",
    });
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
          <CategoryList onEdit={(id) => handleEdit(id, 'category')} onDelete={(id) => handleDelete(id, 'category')} />
        </TabsContent>
        
        <TabsContent value="addons">
          <AddonList onEdit={(id) => handleEdit(id, 'addon')} onDelete={(id) => handleDelete(id, 'addon')} />
        </TabsContent>
        
        <TabsContent value="levels">
          <MenuLevelList onEdit={(id) => handleEdit(id, 'level')} onDelete={(id) => handleDelete(id, 'level')} />
        </TabsContent>
        
        <TabsContent value="options">
          <MenuOptionList onEdit={(id) => handleEdit(id, 'option')} onDelete={(id) => handleDelete(id, 'option')} />
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
              <Input id="name" placeholder="Nome da categoria" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Input id="description" placeholder="Descrição (opcional)" className="col-span-3" />
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
                <Switch id="active" defaultChecked />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>Cancelar</Button>
            <Button onClick={() => handleSaveCategory({})}>Salvar</Button>
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
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input id="name" placeholder="Nome do adicional" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Preço
              </Label>
              <Input id="price" type="number" placeholder="0.00" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">
                Ativo
              </Label>
              <div className="col-span-3 flex items-center">
                <Switch id="active" defaultChecked />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAddonOpen(false)}>Cancelar</Button>
            <Button onClick={() => handleSaveAddon({})}>Salvar</Button>
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
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input id="name" placeholder="Nome do nível" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="min" className="text-right">
                Mínimo
              </Label>
              <Input id="min" type="number" placeholder="0" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="max" className="text-right">
                Máximo
              </Label>
              <Input id="max" type="number" placeholder="1" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">
                Ativo
              </Label>
              <div className="col-span-3 flex items-center">
                <Switch id="active" defaultChecked />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddLevelOpen(false)}>Cancelar</Button>
            <Button onClick={() => handleSaveLevel({})}>Salvar</Button>
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
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input id="name" placeholder="Nome da opção" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Preço adicional
              </Label>
              <Input id="price" type="number" placeholder="0.00" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level" className="text-right">
                Nível
              </Label>
              <Input id="level" placeholder="Selecione o nível" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">
                Ativo
              </Label>
              <div className="col-span-3 flex items-center">
                <Switch id="active" defaultChecked />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOptionOpen(false)}>Cancelar</Button>
            <Button onClick={() => handleSaveOption({})}>Salvar</Button>
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
            <AlertDialogAction onClick={confirmDelete} variant="destructive">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
}
