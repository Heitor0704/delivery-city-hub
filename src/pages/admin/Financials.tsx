
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";

export default function AdminFinancials() {
  return (
    <PageLayout 
      title="Financeiro"
      description="Visualize os dados financeiros de toda a plataforma."
    >
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <h3 className="text-lg font-semibold mb-2">Página Financeira em Construção</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Esta página está sendo desenvolvida. Em breve você poderá visualizar todos os dados financeiros.
          </p>
        </div>
      </Card>
    </PageLayout>
  );
}
