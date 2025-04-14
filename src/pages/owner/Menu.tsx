
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

import { CategoryList } from "@/components/menu/CategoryList";
import { AddonList } from "@/components/menu/AddonList";
import { MenuLevelList } from "@/components/menu/MenuLevelList";
import { MenuOptionList } from "@/components/menu/MenuOptionList";

import { CategoryDialog } from "@/components/menu/dialogs/CategoryDialog";
import { AddonDialog } from "@/components/menu/dialogs/AddonDialog";
import { LevelDialog } from "@/components/menu/dialogs/LevelDialog";
import { OptionDialog } from "@/components/menu/dialogs/OptionDialog";
import { DeleteConfirmationDialog } from "@/components/menu/dialogs/DeleteConfirmationDialog";

export default function OwnerMenu() {
  const [activeTab, setActiveTab] = useState("categories");
  
  // State for add dialogs
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
  
  const handleSaveCategory = (categoryData: any) => {
    // Save category (in a real app, this would be an API call)
    toast({
      title: "Categoria salva",
      description: "A categoria foi salva com sucesso.",
    });
    
    setIsAddCategoryOpen(false);
  };
  
  const handleSaveAddon = (addonData: any) => {
    toast({
      title: "Adicional salvo",
      description: "O adicional foi salvo com sucesso.",
    });
    
    setIsAddAddonOpen(false);
  };
  
  const handleSaveLevel = (levelData: any) => {
    toast({
      title: "Nível salvo",
      description: "O nível foi salvo com sucesso.",
    });
    
    setIsAddLevelOpen(false);
  };
  
  const handleSaveOption = (optionData: any) => {
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

      {/* Dialogs */}
      <CategoryDialog 
        open={isAddCategoryOpen}
        onOpenChange={setIsAddCategoryOpen}
        onSave={handleSaveCategory}
      />
      
      <AddonDialog
        open={isAddAddonOpen}
        onOpenChange={setIsAddAddonOpen}
        onSave={handleSaveAddon}
      />
      
      <LevelDialog
        open={isAddLevelOpen}
        onOpenChange={setIsAddLevelOpen}
        onSave={handleSaveLevel}
      />
      
      <OptionDialog
        open={isAddOptionOpen}
        onOpenChange={setIsAddOptionOpen}
        onSave={handleSaveOption}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </PageLayout>
  );
}
