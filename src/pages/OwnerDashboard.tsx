
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, LineChart } from "@/components/ui/chart";
import { Package, CreditCard, TrendingUp, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Dados simulados para o dashboard
const revenueData = [
  {
    name: "Jan",
    total: 1800,
  },
  {
    name: "Fev",
    total: 2200,
  },
  {
    name: "Mar",
    total: 2500,
  },
  {
    name: "Abr",
    total: 2300,
  },
  {
    name: "Mai",
    total: 2800,
  },
  {
    name: "Jun",
    total: 3200,
  },
  {
    name: "Jul",
    total: 3500,
  },
];

const ordersByDayData = [
  {
    name: "Dom",
    pedidos: 25,
  },
  {
    name: "Seg",
    pedidos: 18,
  },
  {
    name: "Ter",
    pedidos: 22,
  },
  {
    name: "Qua",
    pedidos: 30,
  },
  {
    name: "Qui",
    pedidos: 35,
  },
  {
    name: "Sex",
    pedidos: 48,
  },
  {
    name: "Sáb",
    pedidos: 52,
  },
];

export default function OwnerDashboard() {
  const { toast } = useToast();

  const audio = new Audio("/notification.mp3");

  const playNotificationSound = () => {
    audio.play().catch(error => console.error("Erro ao reproduzir áudio:", error));
  };

  useEffect(() => {
    // Simula recebimento de um novo pedido após 5 segundos
    const timer = setTimeout(() => {
      toast({
        title: "Novo pedido recebido!",
        description: "Pedido #1234 - Cliente: João da Silva",
        variant: "default",
      });
      playNotificationSound();
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Visão Geral</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+15% em relação a ontem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Hoje</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.245,00</div>
            <p className="text-xs text-muted-foreground">+8% em relação a ontem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+3% em relação a ontem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+7% em relação a ontem</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Faturamento</CardTitle>
            <CardDescription>Faturamento dos últimos 7 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={revenueData}
              categories={["total"]}
              colors={["#E53935"]}
              valueFormatter={(value: number) =>
                `R$ ${value.toLocaleString("pt-BR")}`
              }
              className="aspect-[4/3]"
            />
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Pedidos por Dia</CardTitle>
            <CardDescription>Quantidade de pedidos na última semana</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={ordersByDayData}
              categories={["pedidos"]}
              colors={["#1E3A8A"]}
              className="aspect-[4/3]"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Categorias Mais Vendidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>Hambúrgueres</div>
                <div className="text-sm text-muted-foreground">45%</div>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>Pizzas</div>
                <div className="text-sm text-muted-foreground">30%</div>
              </div>
              <Progress value={30} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>Bebidas</div>
                <div className="text-sm text-muted-foreground">15%</div>
              </div>
              <Progress value={15} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>Sobremesas</div>
                <div className="text-sm text-muted-foreground">10%</div>
              </div>
              <Progress value={10} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "12345", customer: "Carlos Silva", time: "10 min atrás", status: "Entregue", total: "R$ 89,90" },
                { id: "12344", customer: "Ana Oliveira", time: "35 min atrás", status: "Em entrega", total: "R$ 65,00" },
                { id: "12343", customer: "João Pereira", time: "1 hora atrás", status: "Preparando", total: "R$ 122,50" },
                { id: "12342", customer: "Maria Souza", time: "2 horas atrás", status: "Entregue", total: "R$ 45,00" },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">Pedido #{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.total}</p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          order.status === "Entregue"
                            ? "bg-green-500"
                            : order.status === "Em entrega"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                      />
                      <span className="text-xs">{order.status}</span>
                    </div>
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
