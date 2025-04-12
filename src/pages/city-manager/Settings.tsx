
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";

export default function CityManagerSettings() {
  return (
    <PageLayout 
      title="Configurações"
      description="Ajuste as configurações da sua cidade."
    >
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <h3 className="text-lg font-semibold mb-2">Configurações em Construção</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Esta página está sendo desenvolvida. Em breve você poderá personalizar todas as configurações.
          </p>
        </div>
      </Card>
    </PageLayout>
  );
}
