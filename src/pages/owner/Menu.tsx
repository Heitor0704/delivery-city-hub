
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function OwnerMenu() {
  return (
    <PageLayout 
      title="Gerenciar Cardápio"
      description="Crie e gerencie as categorias e itens do seu cardápio."
      actions={
        <Button size="sm" className="bg-fomex-orange hover:bg-fomex-orange/90">
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      }
    >
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <h3 className="text-lg font-semibold mb-2">Cardápio em Construção</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Esta página está sendo desenvolvida. Em breve você poderá gerenciar completamente seu cardápio.
          </p>
        </div>
      </Card>
    </PageLayout>
  );
}
