
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";

export default function AdminCompanies() {
  return (
    <PageLayout 
      title="Gerenciar Empresas"
      description="Visualize e gerencie as empresas parceiras."
    >
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <h3 className="text-lg font-semibold mb-2">Página de Empresas em Construção</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Esta página está sendo desenvolvida. Em breve você poderá gerenciar todas as empresas parceiras.
          </p>
        </div>
      </Card>
    </PageLayout>
  );
}
