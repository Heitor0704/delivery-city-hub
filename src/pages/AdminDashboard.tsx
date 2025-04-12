
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, UserCog, BarChart3, CreditCard } from "lucide-react";
import { BarChart, LineChart } from "@/components/ui/chart";

// Dados simulados para o dashboard
const systemGrowthData = [
  {
    name: "Jan",
    cidades: 12,
    estabelecimentos: 78,
  },
  {
    name: "Fev",
    cidades: 14,
    estabelecimentos: 92,
  },
  {
    name: "Mar",
    cidades: 16,
    estabelecimentos: 118,
  },
  {
    name: "Abr",
    cidades: 18,
    estabelecimentos: 145,
  },
  {
    name: "Mai",
    cidades: 21,
    estabelecimentos: 176,
  },
  {
    name: "Jun",
    cidades: 24,
    estabelecimentos: 210,
  },
  {
    name: "Jul",
    cidades: 25,
    estabelecimentos: 235,
  },
];

const cityPerformanceData = [
  {
    name: "São Paulo",
    comissão: 32500,
  },
  {
    name: "Rio de Janeiro",
    comissão: 21700,
  },
  {
    name: "Belo Horizonte",
    comissão: 18600,
  },
  {
    name: "Brasília",
    comissão: 15800,
  },
  {
    name: "Salvador",
    comissão: 12900,
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard do Administrador</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Cidades</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">+1 no último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Gerentes</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
            <p className="text-xs text-muted-foreground">+3 no último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Estabelecimentos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">235</div>
            <p className="text-xs text-muted-foreground">+25 no último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Comissões (Mês)</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 120.500,00</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Crescimento do Sistema</CardTitle>
            <CardDescription>Evolução de cidades e estabelecimentos</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={systemGrowthData}
              categories={["cidades", "estabelecimentos"]}
              colors={["#1E3A8A", "#E53935"]}
              className="aspect-[4/3]"
            />
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Desempenho das Cidades</CardTitle>
            <CardDescription>Comissões por cidade (Top 5)</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={cityPerformanceData}
              categories={["comissão"]}
              colors={["#E53935"]}
              valueFormatter={(value: number) =>
                `R$ ${value.toLocaleString("pt-BR")}`
              }
              className="aspect-[4/3]"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cidades Recentemente Adicionadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Florianópolis", state: "SC", date: "15/04/2023", stores: 8 },
                { name: "Joinville", state: "SC", date: "03/04/2023", stores: 5 },
                { name: "Campinas", state: "SP", date: "28/03/2023", stores: 12 },
                { name: "Vitória", state: "ES", date: "20/03/2023", stores: 7 },
                { name: "Cuiabá", state: "MT", date: "15/03/2023", stores: 6 },
              ].map((city, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{city.name} - {city.state}</p>
                    <p className="text-sm text-muted-foreground">Adicionada em {city.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{city.stores} estabelecimentos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gerentes Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Roberto Mendes", city: "Florianópolis", status: "Ativo", date: "18/04/2023" },
                { name: "Carolina Silva", city: "Joinville", status: "Ativo", date: "05/04/2023" },
                { name: "Pedro Alves", city: "Campinas", status: "Pendente", date: "30/03/2023" },
                { name: "Ana Ferreira", city: "Vitória", status: "Ativo", date: "22/03/2023" },
                { name: "Luiz Oliveira", city: "Cuiabá", status: "Ativo", date: "16/03/2023" },
              ].map((manager, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{manager.name}</p>
                    <p className="text-sm text-muted-foreground">{manager.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{manager.date}</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        manager.status === "Ativo"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {manager.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
