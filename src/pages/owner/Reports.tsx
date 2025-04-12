
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, LineChart } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import {
  DownloadCloud,
  FileText,
  Plus,
  Printer,
  Filter,
  ChevronDown,
  Calendar as CalendarIcon,
} from "lucide-react";
import { addDays, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

const salesChartData = [
  {
    name: "Dom",
    value: 1200,
  },
  {
    name: "Seg",
    value: 900,
  },
  {
    name: "Ter",
    value: 1100,
  },
  {
    name: "Qua",
    value: 1300,
  },
  {
    name: "Qui",
    value: 1500,
  },
  {
    name: "Sex",
    value: 2200,
  },
  {
    name: "Sáb",
    value: 2500,
  },
];

const productsChartData = [
  {
    name: "X-Tudo",
    value: 145,
  },
  {
    name: "X-Salada",
    value: 120,
  },
  {
    name: "Batata Frita",
    value: 98,
  },
  {
    name: "Pizza Calabresa",
    value: 85,
  },
  {
    name: "Coca-Cola",
    value: 210,
  },
  {
    name: "Água Mineral",
    value: 75,
  },
  {
    name: "Cerveja",
    value: 140,
  },
];

const categoriesData = [
  { name: "Hambúrgueres", percent: 45 },
  { name: "Pizzas", percent: 20 },
  { name: "Bebidas", percent: 25 },
  { name: "Sobremesas", percent: 10 },
];

export default function OwnerReports() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfWeek(new Date()),
    to: endOfWeek(new Date())
  });
  const [filterPeriod, setFilterPeriod] = useState("week");
  const [activeTab, setActiveTab] = useState("sales");
  
  const handleFilterChange = (value: string) => {
    const today = new Date();
    
    switch (value) {
      case "today":
        setDate({ from: today, to: today });
        break;
      case "week":
        setDate({
          from: startOfWeek(today, { weekStartsOn: 0 }),
          to: endOfWeek(today, { weekStartsOn: 0 }),
        });
        break;
      case "month":
        setDate({
          from: startOfMonth(today),
          to: endOfMonth(today),
        });
        break;
      case "custom":
        // No change, let user select
        break;
      default:
        break;
    }
    
    setFilterPeriod(value);
  };

  const dateRangeText = () => {
    if (!date?.from) return "Selecione um período";
    
    if (date.to) {
      return `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`;
    }
    return format(date.from, "dd/MM/yyyy");
  };

  return (
    <PageLayout 
      title="Relatórios"
      description="Visualize estatísticas e relatórios do seu estabelecimento."
      actions={
        <Button variant="outline" size="sm">
          <Printer className="mr-2 h-4 w-4" />
          Imprimir Relatório
        </Button>
      }
    >
      <Tabs defaultValue="sales" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="sales" className="flex-1 md:flex-none">Vendas</TabsTrigger>
          <TabsTrigger value="products" className="flex-1 md:flex-none">Produtos</TabsTrigger>
          <TabsTrigger value="categories" className="flex-1 md:flex-none">Categorias</TabsTrigger>
          <TabsTrigger value="delivery" className="flex-1 md:flex-none">Entregas</TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-grow">
            <Select
              value={filterPeriod}
              onValueChange={handleFilterChange}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {filterPeriod === "custom" && (
            <Card className="p-0">
              <CardContent className="p-2">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  locale={ptBR}
                  numberOfMonths={1}
                />
              </CardContent>
            </Card>
          )}
          
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>Período: {dateRangeText()}</span>
          </div>
        </div>
        
        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 9.700,00</div>
                <p className="text-xs text-muted-foreground">+18% em relação ao período anterior</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Quantidade de Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">285</div>
                <p className="text-xs text-muted-foreground">+12% em relação ao período anterior</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Valor Médio por Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 34,04</div>
                <p className="text-xs text-muted-foreground">+5% em relação ao período anterior</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Dia</CardTitle>
              <CardDescription>Valor total de vendas por dia da semana</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={salesChartData}
                categories={["value"]}
                index="name"
                colors={["#E53935"]}
                valueFormatter={(value: number) =>
                  `R$ ${value.toLocaleString("pt-BR")}`
                }
                className="aspect-[4/2]"
              />
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <DownloadCloud className="mr-2 h-4 w-4" />
                Exportar Relatório de Vendas (PDF)
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Produtos Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">873</div>
                <p className="text-xs text-muted-foreground">42 produtos diferentes</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Produto Mais Vendido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">X-Tudo</div>
                <p className="text-xs text-muted-foreground">145 unidades</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Produto Mais Rentável</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Pizza Calabresa</div>
                <p className="text-xs text-muted-foreground">Margem de 65%</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Vendidos</CardTitle>
              <CardDescription>Quantidade vendida por produto</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={productsChartData}
                categories={["value"]}
                index="name"
                colors={["#1E3A8A"]}
                valueFormatter={(value: number) =>
                  `${value} unidades`
                }
                className="aspect-[4/2]"
              />
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <DownloadCloud className="mr-2 h-4 w-4" />
                Exportar Relatório de Produtos (PDF)
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Categoria</CardTitle>
              <CardDescription>Distribuição percentual das vendas por categoria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {categoriesData.map((category) => (
                <div key={category.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{category.name}</span>
                    <span>{category.percent}%</span>
                  </div>
                  <Progress value={category.percent} className="h-2" />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <DownloadCloud className="mr-2 h-4 w-4" />
                Exportar Relatório de Categorias (PDF)
              </Button>
            </CardFooter>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Categoria Mais Vendida</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold">Hambúrgueres</div>
                <p className="text-muted-foreground">
                  Representa 45% das vendas totais com um crescimento de 12% em relação ao período anterior.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Categoria Mais Rentável</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold">Bebidas</div>
                <p className="text-muted-foreground">
                  Apesar de representar 25% das vendas, possui a maior margem de lucro com 75% em média.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="delivery" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de Entregas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">248</div>
                <p className="text-xs text-muted-foreground">87% dos pedidos</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tempo Médio de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28 min</div>
                <p className="text-xs text-muted-foreground">-5% em relação ao período anterior</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Taxa Média de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 5,00</div>
                <p className="text-xs text-muted-foreground">Distância média de 3,2 km</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho dos Entregadores</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 text-left">Entregador</th>
                      <th className="p-3 text-left">Entregas</th>
                      <th className="p-3 text-left">Tempo Médio</th>
                      <th className="p-3 text-left">Avaliação</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3">Carlos Silva</td>
                      <td className="p-3">78</td>
                      <td className="p-3">25 min</td>
                      <td className="p-3">4.9/5</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3">Ana Oliveira</td>
                      <td className="p-3">65</td>
                      <td className="p-3">28 min</td>
                      <td className="p-3">4.8/5</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3">João Santos</td>
                      <td className="p-3">58</td>
                      <td className="p-3">30 min</td>
                      <td className="p-3">4.7/5</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3">Maria Costa</td>
                      <td className="p-3">47</td>
                      <td className="p-3">27 min</td>
                      <td className="p-3">4.9/5</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Regiões de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Centro</span>
                    <span>35%</span>
                  </div>
                  <Progress value={35} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Zona Norte</span>
                    <span>28%</span>
                  </div>
                  <Progress value={28} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Zona Sul</span>
                    <span>22%</span>
                  </div>
                  <Progress value={22} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Zona Leste</span>
                    <span>10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Zona Oeste</span>
                    <span>5%</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
