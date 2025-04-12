
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";

export default function AdminRegistrations() {
  return (
    <PageLayout 
      title="Gerenciar Cadastros"
      description="Gerencie os cadastros de toda a plataforma."
    >
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <h3 className="text-lg font-semibold mb-2">Página de Cadastros em Construção</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Esta página está sendo desenvolvida. Em breve você poderá gerenciar todos os tipos de cadastros.
          </p>
        </div>
      </Card>
    </PageLayout>
  );
}
