
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

import { CategoryList } from "@/components/menu/CategoryList";
import { MenuLevelList } from "@/components/menu/MenuLevelList";
import { MenuOptionList } from "@/components/menu/MenuOptionList";

import { CategoryDialog } from "@/components/menu/dialogs/CategoryDialog";
import { LevelDialog } from "@/components/menu/dialogs/LevelDialog";
import { OptionDialog } from "@/components/menu/dialogs/OptionDialog";
import { DeleteConfirmationDialog } from "@/components/menu/dialogs/DeleteConfirmationDialog";

// Sample options data for demonstration
const initialMenuOptions = [
  { id: 1, nome: "Picanha", preco: "R$ 5,00", nivel: "Proteína", ativo: true },
  { id: 2, nome: "Filé Mignon", preco: "R$ 7,00", nivel: "Proteína", ativo: true },
  { id: 3, nome: "Pequeno", preco: "R$ 0,00", nivel: "Tamanho", ativo: true },
  { id: 4, nome: "Médio", preco: "R$ 3,00", nivel: "Tamanho", ativo: true },
  { id: 5, nome: "Grande", preco: "R$ 5,00", nivel: "Tamanho", ativo: false },
  { id: 6, nome: "Batata Frita", preco: "R$ 8,00", nivel: "Adicionais", ativo: true },
  { id: 7, nome: "Bacon Extra", preco: "R$ 4,00", nivel: "Adicionais", ativo: true },
];

export default function OwnerMenu() {
  const [activeTab, setActiveTab] = useState("categories");
  const [menuOptions, setMenuOptions] = useState(initialMenuOptions);
  
  // State for add dialogs
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
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
  
  const handleSaveLevel = (levelData: any) => {
    // Store selected options in the level
    console.log("Nível salvo com opções:", levelData);
    
    toast({
      title: "Nível salvo",
      description: "O nível foi salvo com sucesso.",
    });
    
    setIsAddLevelOpen(false);
  };
  
  const handleSaveOption = (optionData: any) => {
    // In a real app, we would add this to the menuOptions state
    const newOption = {
      id: menuOptions.length + 1,
      nome: optionData.name,
      preco: optionData.price,
      nivel: optionData.level,
      ativo: optionData.active
    };
    
    setMenuOptions([...menuOptions, newOption]);
    
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
          <TabsTrigger value="levels" className="flex-1 md:flex-none">Níveis</TabsTrigger>
          <TabsTrigger value="options" className="flex-1 md:flex-none">Opções</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <CategoryList onDelete={(id) => handleDelete(id, 'category')} />
        </TabsContent>
        
        <TabsContent value="levels">
          <MenuLevelList onDelete={(id) => handleDelete(id, 'level')} />
        </TabsContent>
        
        <TabsContent value="options">
          <MenuOptionList 
            onDelete={(id) => handleDelete(id, 'option')}
            onSaveOption={(option) => {
              // Update menuOptions state when an option is saved via MenuOptionList
              const updatedOptions = menuOptions.map(o => 
                o.id === option.id ? option : o
              );
              setMenuOptions(updatedOptions);
            }} 
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CategoryDialog 
        open={isAddCategoryOpen}
        onOpenChange={setIsAddCategoryOpen}
        onSave={handleSaveCategory}
      />
      
      <LevelDialog
        open={isAddLevelOpen}
        onOpenChange={setIsAddLevelOpen}
        onSave={handleSaveLevel}
        availableOptions={menuOptions}
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
