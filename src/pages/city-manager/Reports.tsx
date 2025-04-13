
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Bar, 
  BarChart, 
  CartesianGrid,
  Legend, 
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { CalendarIcon, Download, FilterIcon } from "lucide-react";

// Mock sales data
const salesData = [
  { name: "Jan", stores: 35, revenue: 2400, orders: 240 },
  { name: "Fev", stores: 40, revenue: 3600, orders: 380 },
  { name: "Mar", stores: 45, revenue: 4200, orders: 430 },
  { name: "Abr", stores: 47, revenue: 3800, orders: 390 },
  { name: "Mai", stores: 48, revenue: 4800, orders: 480 },
  { name: "Jun", stores: 52, revenue: 5200, orders: 520 },
];

// Mock stores data
const storesData = [
  { name: "Restaurante A", orders: 156, revenue: 7890, commission: 789 },
  { name: "Pizzaria B", orders: 142, revenue: 6540, commission: 654 },
  { name: "Hamburgueria C", orders: 125, revenue: 5980, commission: 598 },
  { name: "Doceria D", orders: 98, revenue: 3450, commission: 345 },
  { name: "Japonês E", orders: 87, revenue: 4320, commission: 432 },
  { name: "Lanchonete F", orders: 76, revenue: 2890, commission: 289 },
];

// Mock deliverers data
const deliverersData = [
  { name: "João S.", deliveries: 98, revenue: 1470, commission: 147 },
  { name: "Maria O.", deliveries: 87, revenue: 1305, commission: 130 },
  { name: "Pedro A.", deliveries: 76, revenue: 1140, commission: 114 },
  { name: "Ana L.", deliveries: 65, revenue: 975, commission: 97 },
  { name: "Carlos M.", deliveries: 54, revenue: 810, commission: 81 },
  { name: "Beatriz N.", deliveries: 43, revenue: 645, commission: 64 },
];

export default function CityManagerReports() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [period, setPeriod] = useState("month");

  return (
    <PageLayout 
      title="Relatórios"
      description="Acompanhe o desempenho da sua cidade com relatórios detalhados."
      actions={
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-dashed">
                <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yy")} -{" "}
                      {format(dateRange.to, "dd/MM/yy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yy")
                  )
                ) : (
                  <span>Filtrar por data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                locale={ptBR}
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          
          <Select defaultValue={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-8 w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Diário</SelectItem>
              <SelectItem value="week">Semanal</SelectItem>
              <SelectItem value="month">Mensal</SelectItem>
              <SelectItem value="year">Anual</SelectItem>
            </SelectContent>
          </Select>
          
          <Button size="sm" variant="outline" className="h-8">
            <Download className="mr-2 h-3.5 w-3.5" />
            Exportar
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="stores">Estabelecimentos</TabsTrigger>
            <TabsTrigger value="deliverers">Entregadores</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Faturamento Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 24.565,00</div>
                  <p className="text-xs text-muted-foreground">
                    +18% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Pedidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.430</div>
                  <p className="text-xs text-muted-foreground">
                    +12% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Ticket Médio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 47,23</div>
                  <p className="text-xs text-muted-foreground">
                    +2% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Estabelecimentos Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">52</div>
                  <p className="text-xs text-muted-foreground">
                    +4 novos este mês
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Faturamento Mensal</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Faturamento (R$ x100)"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="orders" name="Pedidos" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Crescimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="stores" name="Estabelecimentos" fill="#8884d8" />
                      <Bar dataKey="orders" name="Pedidos (x10)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Stores Tab */}
          <TabsContent value="stores" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho dos Estabelecimentos</CardTitle>
                <CardDescription>
                  Comparativo de pedidos e faturamento por estabelecimento.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart 
                    data={storesData}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" name="Pedidos" fill="#8884d8" />
                    <Bar dataKey="revenue" name="Faturamento (R$)" fill="#82ca9d" />
                    <Bar dataKey="commission" name="Comissão (R$)" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Deliverers Tab */}
          <TabsContent value="deliverers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho dos Entregadores</CardTitle>
                <CardDescription>
                  Comparativo de entregas e faturamento por entregador.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart 
                    data={deliverersData}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="deliveries" name="Entregas" fill="#8884d8" />
                    <Bar dataKey="revenue" name="Faturamento (R$)" fill="#82ca9d" />
                    <Bar dataKey="commission" name="Comissão (R$)" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Receita Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 24.565,00</div>
                  <p className="text-xs text-muted-foreground">
                    Valor total faturado
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Comissões de Estabelecimentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 2.456,50</div>
                  <p className="text-xs text-muted-foreground">
                    10% do faturamento total
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Comissões de Entregadores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 1.228,25</div>
                  <p className="text-xs text-muted-foreground">
                    5% do valor das entregas
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Lucro Líquido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 3.684,75</div>
                  <p className="text-xs text-muted-foreground">
                    15% do faturamento total
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Evolução Financeira</CardTitle>
                <CardDescription>
                  Análise mensal de receitas e comissões.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Receita Total (R$ x100)"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="orders" 
                      name="Comissões (R$ x10)" 
                      stroke="#82ca9d"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
