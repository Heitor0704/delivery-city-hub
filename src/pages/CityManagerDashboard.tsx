
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, CreditCard, ShoppingBag } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BarChart, LineChart } from "@/components/ui/chart";

// Dados simulados para o dashboard
const monthlyCommissionData = [
  {
    name: "Jan",
    comissões: 5200,
  },
  {
    name: "Fev",
    comissões: 4800,
  },
  {
    name: "Mar",
    comissões: 6100,
  },
  {
    name: "Abr",
    comissões: 5900,
  },
  {
    name: "Mai",
    comissões: 6800,
  },
  {
    name: "Jun",
    comissões: 7200,
  },
  {
    name: "Jul",
    comissões: 8500,
  },
];

const storePerformanceData = [
  {
    name: "Rest. A",
    vendas: 89,
  },
  {
    name: "Rest. B",
    vendas: 75,
  },
  {
    name: "Rest. C",
    vendas: 120,
  },
  {
    name: "Rest. D",
    vendas: 45,
  },
  {
    name: "Rest. E",
    vendas: 60,
  },
];

export default function CityManagerDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard do Gerente da Cidade</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Estabelecimentos</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">+3 no último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Entregadores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">+10 no último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Comissões (Mês)</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 8.500,00</div>
            <p className="text-xs text-muted-foreground">+15% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pedidos (Mês)</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.254</div>
            <p className="text-xs text-muted-foreground">+8% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Comissões Mensais</CardTitle>
            <CardDescription>Evolução das comissões nos últimos 7 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={monthlyCommissionData}
              categories={["comissões"]}
              colors={["#1E3A8A"]}
              valueFormatter={(value: number) =>
                `R$ ${value.toLocaleString("pt-BR")}`
              }
              className="aspect-[4/3]"
            />
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Desempenho dos Estabelecimentos</CardTitle>
            <CardDescription>Número de pedidos por estabelecimento (Top 5)</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={storePerformanceData}
              categories={["vendas"]}
              colors={["#E53935"]}
              className="aspect-[4/3]"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Categorias Mais Populares</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>Fast Food</div>
                <div className="text-sm text-muted-foreground">40%</div>
              </div>
              <Progress value={40} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>Pizza</div>
                <div className="text-sm text-muted-foreground">25%</div>
              </div>
              <Progress value={25} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>Brasileira</div>
                <div className="text-sm text-muted-foreground">18%</div>
              </div>
              <Progress value={18} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>Asiática</div>
                <div className="text-sm text-muted-foreground">12%</div>
              </div>
              <Progress value={12} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>Saudável</div>
                <div className="text-sm text-muted-foreground">5%</div>
              </div>
              <Progress value={5} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estabelecimentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Burguer Gourmet", category: "Fast Food", status: "Ativo", date: "15/03/2023" },
                { name: "Pizza da Nonna", category: "Pizzaria", status: "Ativo", date: "02/04/2023" },
                { name: "Sushi House", category: "Asiática", status: "Pendente", date: "10/04/2023" },
                { name: "Açaí Express", category: "Sobremesas", status: "Ativo", date: "18/04/2023" },
                { name: "Vegetariano & Cia", category: "Saudável", status: "Pendente", date: "25/04/2023" },
              ].map((store, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{store.name}</p>
                    <p className="text-sm text-muted-foreground">{store.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{store.date}</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        store.status === "Ativo"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {store.status}
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
