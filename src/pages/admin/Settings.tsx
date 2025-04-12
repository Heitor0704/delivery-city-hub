
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";

export default function AdminSettings() {
  return (
    <PageLayout 
      title="Configurações"
      description="Ajuste as configurações globais da plataforma."
    >
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <h3 className="text-lg font-semibold mb-2">Página de Configurações em Construção</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Esta página está sendo desenvolvida. Em breve você poderá ajustar todas as configurações globais.
          </p>
        </div>
      </Card>
    </PageLayout>
  );
}
