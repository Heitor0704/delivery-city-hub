
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, LineChart } from "@/components/ui/chart";
import { Package, CreditCard, TrendingUp, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRestaurant } from "@/hooks/useRestaurant";
import { formatCurrency } from "@/lib/formatters";

export default function OwnerDashboard() {
  const { toast } = useToast();
  const { 
    restaurant, 
    isLoading, 
    recentOrders, 
    orderStats,
    salesByMonth,
    ordersByDay,
    categorySales
  } = useRestaurant();

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-fomex-orange" />
        <span className="ml-2">Carregando dados do estabelecimento...</span>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Estabelecimento não encontrado</h1>
        <p>Não foi possível encontrar um estabelecimento associado ao seu usuário.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Visão Geral - {restaurant.nome_estabelecimento}</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats?.today || 0}</div>
            <p className="text-xs text-muted-foreground">+15% em relação a ontem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Hoje</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(orderStats?.revenue || 0)}</div>
            <p className="text-xs text-muted-foreground">+8% em relação a ontem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats?.conversion || 0}%</div>
            <p className="text-xs text-muted-foreground">+3% em relação a ontem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats?.newCustomers || 0}</div>
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
              data={salesByMonth}
              categories={["total"]}
              colors={["#E53935"]}
              valueFormatter={(value: number) =>
                formatCurrency(value)
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
              data={ordersByDay}
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
            {categorySales.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>{category.name}</div>
                  <div className="text-sm text-muted-foreground">{category.percentage}%</div>
                </div>
                <Progress value={category.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">Cliente #{order.cliente_userId?.substring(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">Pedido #{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(order.valor_total || 0)}</p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${
                            order.status === "entregue"
                              ? "bg-green-500"
                              : order.status === "em_entrega"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <span className="text-xs">{
                          order.status === "entregue" ? "Entregue" :
                          order.status === "em_entrega" ? "Em entrega" :
                          order.status === "preparando" ? "Preparando" :
                          order.status
                        }</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum pedido recente encontrado.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
