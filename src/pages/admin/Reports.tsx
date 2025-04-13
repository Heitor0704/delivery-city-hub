
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart } from "@/components/ui/chart";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { 
  CalendarIcon, 
  ChevronDown, 
  Download, 
  FileBarChart, 
  FileText, 
  FileSpreadsheet, 
  Printer 
} from "lucide-react";
import { 
  addDays, 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  subMonths 
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const yearlyRevenueData = [
  { name: "Jan", revenue: 85000, expenses: 35000 },
  { name: "Fev", revenue: 92000, expenses: 38000 },
  { name: "Mar", revenue: 99000, expenses: 40000 },
  { name: "Abr", revenue: 105000, expenses: 42000 },
  { name: "Mai", revenue: 112000, expenses: 45000 },
  { name: "Jun", revenue: 118000, expenses: 47000 },
  { name: "Jul", revenue: 125000, expenses: 50000 },
  { name: "Ago", revenue: 132000, expenses: 52000 },
  { name: "Set", revenue: 138000, expenses: 54000 },
  { name: "Out", revenue: 145000, expenses: 56000 },
  { name: "Nov", revenue: 152000, expenses: 58000 },
  { name: "Dez", revenue: 158000, expenses: 60000 },
];

const cityRevenueData = [
  { name: "São Paulo", revenue: 450000 },
  { name: "Rio de Janeiro", revenue: 320000 },
  { name: "Belo Horizonte", revenue: 280000 },
  { name: "Curitiba", revenue: 210000 },
  { name: "Salvador", revenue: 185000 },
  { name: "Fortaleza", revenue: 150000 },
  { name: "Brasília", revenue: 135000 },
  { name: "Recife", revenue: 120000 },
];

const establishmentTypeData = [
  { name: "Fast Food", revenue: 380000 },
  { name: "Pizzarias", revenue: 310000 },
  { name: "Restaurantes", revenue: 290000 },
  { name: "Churrascarias", revenue: 210000 },
  { name: "Asiáticos", revenue: 180000 },
  { name: "Padarias", revenue: 150000 },
  { name: "Cafeterias", revenue: 130000 },
  { name: "Outros", revenue: 100000 },
];

const growthData = [
  { name: "Jan", users: 5000, establishments: 120, orders: 28000 },
  { name: "Fev", users: 5800, establishments: 138, orders: 32000 },
  { name: "Mar", users: 6700, establishments: 155, orders: 36000 },
  { name: "Abr", users: 7600, establishments: 172, orders: 41000 },
  { name: "Mai", users: 8500, establishments: 190, orders: 46000 },
  { name: "Jun", users: 9300, establishments: 205, orders: 51000 },
  { name: "Jul", users: 10200, establishments: 225, orders: 56000 },
  { name: "Ago", users: 11000, establishments: 245, orders: 61000 },
  { name: "Set", users: 12000, establishments: 265, orders: 66000 },
  { name: "Out", users: 12900, establishments: 282, orders: 71000 },
  { name: "Nov", users: 13800, establishments: 300, orders: 76000 },
  { name: "Dez", users: 15000, establishments: 320, orders: 82000 },
];

export default function AdminReports() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 11),
    to: new Date()
  });
  const [filterPeriod, setFilterPeriod] = useState("year");
  const [currentReport, setCurrentReport] = useState("financial");

  const handleFilterChange = (value: string) => {
    const today = new Date();
    
    switch (value) {
      case "month":
        setDate({
          from: startOfMonth(today),
          to: endOfMonth(today),
        });
        break;
      case "quarter":
        setDate({
          from: subMonths(today, 3),
          to: today,
        });
        break;
      case "year":
        setDate({
          from: subMonths(today, 11),
          to: today,
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
      description="Visualize estatísticas e relatórios de toda a plataforma."
      actions={
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              Exportar como PDF
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Exportar como Excel
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir relatório
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    >
      <Tabs defaultValue="financial" className="space-y-4" onValueChange={setCurrentReport} value={currentReport}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="financial" className="flex-1 sm:flex-none">Financeiro</TabsTrigger>
          <TabsTrigger value="growth" className="flex-1 sm:flex-none">Crescimento</TabsTrigger>
          <TabsTrigger value="cities" className="flex-1 sm:flex-none">Cidades</TabsTrigger>
          <TabsTrigger value="custom" className="flex-1 sm:flex-none">Relatórios Personalizados</TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-grow">
            <Select
              value={filterPeriod}
              onValueChange={handleFilterChange}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Este mês</SelectItem>
                <SelectItem value="quarter">Último trimestre</SelectItem>
                <SelectItem value="year">Último ano</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {filterPeriod === "custom" && (
            <Card>
              <CardContent className="p-2">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  locale={ptBR}
                  numberOfMonths={2}
                />
              </CardContent>
            </Card>
          )}
          
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>Período: {dateRangeText()}</span>
          </div>
        </div>
        
        {/* Conteúdo da tab Financeiro */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
                <CardDescription>Período selecionado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 1.450.000,00</div>
                <p className="text-xs text-green-600">+12% em relação ao período anterior</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Comissões</CardTitle>
                <CardDescription>Valores recebidos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 290.000,00</div>
                <p className="text-xs text-green-600">+15% em relação ao período anterior</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                <CardDescription>Por pedido</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 47,90</div>
                <p className="text-xs text-green-600">+5% em relação ao período anterior</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
                <CardDescription>Período selecionado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32.435</div>
                <p className="text-xs text-green-600">+18% em relação ao período anterior</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Receita vs Despesas</CardTitle>
                <CardDescription>Acompanhamento nos últimos 12 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={yearlyRevenueData}
                  categories={["revenue", "expenses"]}
                  colors={["#16A34A", "#DC2626"]}
                  valueFormatter={(value: number) =>
                    `R$ ${value.toLocaleString("pt-BR")}`
                  }
                  className="aspect-[4/3]"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Receita por Tipo de Estabelecimento</CardTitle>
                <CardDescription>Distribuição no período selecionado</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={establishmentTypeData}
                  categories={["revenue"]}
                  colors={["#E11D48"]}
                  valueFormatter={(value: number) =>
                    `R$ ${value.toLocaleString("pt-BR")}`
                  }
                  className="aspect-[4/3]"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Conteúdo da tab Crescimento */}
        <TabsContent value="growth" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                <CardDescription>Usuários ativos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15.000</div>
                <p className="text-xs text-green-600">+22% em relação ao período anterior</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Estabelecimentos</CardTitle>
                <CardDescription>Estabelecimentos cadastrados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">320</div>
                <p className="text-xs text-green-600">+15% em relação ao período anterior</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cidades Ativas</CardTitle>
                <CardDescription>Atualmente operando</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32</div>
                <p className="text-xs text-green-600">+4 em relação ao período anterior</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Crescimento ao Longo do Tempo</CardTitle>
              <CardDescription>Últimos 12 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={growthData}
                categories={["users", "establishments", "orders"]}
                colors={["#3B82F6", "#10B981", "#F59E0B"]}
                valueFormatter={(value: number) =>
                  `${value.toLocaleString("pt-BR")}`
                }
                className="aspect-[16/9]"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Conteúdo da tab Cidades */}
        <TabsContent value="cities" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de Cidades</CardTitle>
                <CardDescription>Cidades ativas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Estados Cobertos</CardTitle>
                <CardDescription>Presença nacional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cidade mais Ativa</CardTitle>
                <CardDescription>Por volume de pedidos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">São Paulo</div>
                <p className="text-xs text-muted-foreground">12.450 pedidos</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cidade em Crescimento</CardTitle>
                <CardDescription>Maior aumento percentual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Recife</div>
                <p className="text-xs text-green-600">+45% em pedidos</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Receita por Cidade</CardTitle>
              <CardDescription>Top cidades no período selecionado</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={cityRevenueData}
                categories={["revenue"]}
                colors={["#8B5CF6"]}
                valueFormatter={(value: number) =>
                  `R$ ${value.toLocaleString("pt-BR")}`
                }
                className="aspect-[16/9]"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Conteúdo da tab Relatórios Personalizados */}
        <TabsContent value="custom" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:border-fomex-orange hover:shadow-md transition-all cursor-pointer">
              <CardHeader>
                <FileBarChart className="h-8 w-8 mb-2 text-fomex-orange" />
                <CardTitle>Relatório de Desempenho por Cidade</CardTitle>
                <CardDescription>
                  Compare o desempenho entre todas as cidades ativas.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end">
                <Button variant="outline">Gerar Relatório</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:border-fomex-orange hover:shadow-md transition-all cursor-pointer">
              <CardHeader>
                <FileBarChart className="h-8 w-8 mb-2 text-fomex-orange" />
                <CardTitle>Análise de Categorias de Estabelecimentos</CardTitle>
                <CardDescription>
                  Desempenho das diferentes categorias de estabelecimentos.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end">
                <Button variant="outline">Gerar Relatório</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:border-fomex-orange hover:shadow-md transition-all cursor-pointer">
              <CardHeader>
                <FileBarChart className="h-8 w-8 mb-2 text-fomex-orange" />
                <CardTitle>Relatório de Taxas e Comissões</CardTitle>
                <CardDescription>
                  Detalhamento de todas as taxas e comissões cobradas.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end">
                <Button variant="outline">Gerar Relatório</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:border-fomex-orange hover:shadow-md transition-all cursor-pointer">
              <CardHeader>
                <FileBarChart className="h-8 w-8 mb-2 text-fomex-orange" />
                <CardTitle>Análise de Entregadores</CardTitle>
                <CardDescription>
                  Estatísticas sobre os entregadores e suas entregas.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end">
                <Button variant="outline">Gerar Relatório</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:border-fomex-orange hover:shadow-md transition-all cursor-pointer">
              <CardHeader>
                <FileBarChart className="h-8 w-8 mb-2 text-fomex-orange" />
                <CardTitle>Uso de Cupons e Promoções</CardTitle>
                <CardDescription>
                  Estatísticas sobre o uso de cupons e seu impacto nas vendas.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end">
                <Button variant="outline">Gerar Relatório</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:border-fomex-orange hover:shadow-md transition-all cursor-pointer">
              <CardHeader>
                <FileBarChart className="h-8 w-8 mb-2 text-fomex-orange" />
                <CardTitle>Relatório Financeiro Completo</CardTitle>
                <CardDescription>
                  Análise financeira detalhada de toda a operação.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end">
                <Button variant="outline">Gerar Relatório</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
