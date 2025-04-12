
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";

export default function CityManagerCommissions() {
  return (
    <PageLayout 
      title="Financeiro"
      description="Visualize as comissões e finanças da sua cidade."
    >
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <h3 className="text-lg font-semibold mb-2">Financeiro em Construção</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Esta página está sendo desenvolvida. Em breve você poderá visualizar todas as informações financeiras.
          </p>
        </div>
      </Card>
    </PageLayout>
  );
}
