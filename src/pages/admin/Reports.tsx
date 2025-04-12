
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";

export default function AdminReports() {
  return (
    <PageLayout 
      title="Relatórios"
      description="Visualize estatísticas e relatórios de toda a plataforma."
    >
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <h3 className="text-lg font-semibold mb-2">Página de Relatórios em Construção</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Esta página está sendo desenvolvida. Em breve você terá acesso a relatórios detalhados.
          </p>
        </div>
      </Card>
    </PageLayout>
  );
}
