
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2 } from "lucide-react";
import { CategoryList } from "@/components/menu/CategoryList";
import { AddonList } from "@/components/menu/AddonList";
import { MenuLevelList } from "@/components/menu/MenuLevelList";
import { MenuOptionList } from "@/components/menu/MenuOptionList";

export default function OwnerMenu() {
  const [activeTab, setActiveTab] = useState("categories");

  return (
    <PageLayout 
      title="Gerenciar Cardápio"
      description="Crie e gerencie as categorias e itens do seu cardápio."
      actions={
        <>
          {activeTab === "categories" && (
            <Button size="sm" className="bg-fomex-orange hover:bg-fomex-orange/90">
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          )}
          {activeTab === "addons" && (
            <Button size="sm" className="bg-fomex-orange hover:bg-fomex-orange/90">
              <Plus className="mr-2 h-4 w-4" />
              Novo Adicional
            </Button>
          )}
          {activeTab === "levels" && (
            <Button size="sm" className="bg-fomex-orange hover:bg-fomex-orange/90">
              <Plus className="mr-2 h-4 w-4" />
              Novo Nível
            </Button>
          )}
          {activeTab === "options" && (
            <Button size="sm" className="bg-fomex-orange hover:bg-fomex-orange/90">
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
          <CategoryList />
        </TabsContent>
        
        <TabsContent value="addons">
          <AddonList />
        </TabsContent>
        
        <TabsContent value="levels">
          <MenuLevelList />
        </TabsContent>
        
        <TabsContent value="options">
          <MenuOptionList />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
