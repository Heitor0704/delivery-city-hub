
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";

export default function CityManagerReports() {
  return (
    <PageLayout 
      title="Relatórios"
      description="Visualize estatísticas e relatórios da sua cidade."
    >
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <h3 className="text-lg font-semibold mb-2">Relatórios em Construção</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Esta página está sendo desenvolvida. Em breve você terá acesso a relatórios detalhados.
          </p>
        </div>
      </Card>
    </PageLayout>
  );
}
