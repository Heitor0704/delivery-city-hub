
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { LineChart, BarChart } from "@/components/ui/chart";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { DateRange } from "react-day-picker";
import { 
  Calendar as CalendarIcon, 
  ChevronDown, 
  Download, 
  Eye,
  FileText,
  ArrowDownUp,
  TrendingUp,
  TrendingDown,
  DownloadCloud,
  DollarSign,
  CreditCard,
  Wallet
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
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// Dados simulados para o relatório financeiro
const transactionData = [
  {
    id: 1,
    data: "2025-04-01",
    estabelecimento: "Burger King",
    cidade: "São Paulo",
    tipo: "comissao",
    faturamento: 8540.75,
    taxa: 854.08,
    status: "concluido",
  },
  {
    id: 2,
    data: "2025-04-01",
    estabelecimento: "Pizza Hut",
    cidade: "Rio de Janeiro",
    tipo: "comissao",
    faturamento: 7230.50,
    taxa: 723.05,
    status: "concluido",
  },
  {
    id: 3,
    data: "2025-04-02",
    estabelecimento: "China in Box",
    cidade: "São Paulo",
    tipo: "comissao",
    faturamento: 4120.25,
    taxa: 412.03,
    status: "concluido",
  },
  {
    id: 4,
    data: "2025-04-02",
    estabelecimento: "Outback",
    cidade: "Belo Horizonte",
    tipo: "comissao",
    faturamento: 12450.80,
    taxa: 1245.08,
    status: "pendente",
  },
  {
    id: 5,
    data: "2025-04-03",
    estabelecimento: "Sushi Temaki",
    cidade: "Curitiba",
    tipo: "comissao",
    faturamento: 5230.45,
    taxa: 523.05,
    status: "concluido",
  },
  {
    id: 6,
    data: "2025-04-03",
    estabelecimento: "Madero",
    cidade: "São Paulo",
    tipo: "comissao",
    faturamento: 9870.30,
    taxa: 987.03,
    status: "concluido",
  },
  {
    id: 7,
    data: "2025-04-04",
    estabelecimento: "Entrega Express",
    cidade: "Salvador",
    tipo: "entrega",
    faturamento: 3850.25,
    taxa: 192.51,
    status: "pendente",
  },
];

// Dados para o gráfico
const revenueData = [
  { name: "Jan", faturamento: 245000, comissao: 24500 },
  { name: "Fev", faturamento: 275000, comissao: 27500 },
  { name: "Mar", faturamento: 305000, comissao: 30500 },
  { name: "Abr", faturamento: 340000, comissao: 34000 },
  { name: "Mai", faturamento: 380000, comissao: 38000 },
  { name: "Jun", faturamento: 425000, comissao: 42500 },
  { name: "Jul", faturamento: 470000, comissao: 47000 },
  { name: "Ago", faturamento: 510000, comissao: 51000 },
  { name: "Set", faturamento: 545000, comissao: 54500 },
  { name: "Out", faturamento: 580000, comissao: 58000 },
  { name: "Nov", faturamento: 615000, comissao: 61500 },
  { name: "Dez", faturamento: 650000, comissao: 65000 },
];

const revenueCityData = [
  { name: "São Paulo", faturamento: 450000, comissao: 45000 },
  { name: "Rio de Janeiro", faturamento: 350000, comissao: 35000 },
  { name: "Belo Horizonte", faturamento: 240000, comissao: 24000 },
  { name: "Curitiba", faturamento: 180000, comissao: 18000 },
  { name: "Salvador", faturamento: 150000, comissao: 15000 },
  { name: "Fortaleza", faturamento: 120000, comissao: 12000 },
];

// Lista de cidades
const cities = [
  "Todas",
  "São Paulo",
  "Rio de Janeiro",
  "Belo Horizonte", 
  "Curitiba",
  "Salvador",
  "Fortaleza"
];

const statusColors: Record<string, string> = {
  concluido: "bg-green-100 text-green-800 hover:bg-green-100",
  pendente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  cancelado: "bg-red-100 text-red-800 hover:bg-red-100",
};

export default function AdminFinancials() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [filterPeriod, setFilterPeriod] = useState("month");
  const [cityFilter, setCityFilter] = useState("Todas");
  const { toast } = useToast();

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

  // Filtrar transações por data e cidade
  const filteredTransactions = transactionData.filter((transaction) => {
    const transactionDate = new Date(transaction.data);
    const isInDateRange = (!date?.from || transactionDate >= date.from) &&
                          (!date?.to || transactionDate <= date.to);
    const isInCity = cityFilter === "Todas" || transaction.cidade === cityFilter;
    
    return isInDateRange && isInCity;
  });
  
  // Calcular totais
  const totals = filteredTransactions.reduce((acc, curr) => {
    return {
      faturamento: acc.faturamento + curr.faturamento,
      taxa: acc.taxa + curr.taxa,
    };
  }, { faturamento: 0, taxa: 0 });

  const dateRangeText = () => {
    if (!date?.from) return "Selecione um período";
    
    if (date.to) {
      return `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`;
    }
    return format(date.from, "dd/MM/yyyy");
  };

  const handleDownloadInvoice = () => {
    toast({
      title: "Nota fiscal gerada",
      description: "A nota fiscal foi gerada e enviada para seu email.",
    });
  };

  return (
    <PageLayout 
      title="Financeiro"
      description="Visualize os dados financeiros de toda a plataforma."
      actions={
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <DownloadCloud className="mr-2 h-4 w-4" />
              Exportar
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleDownloadInvoice}>
              <FileText className="mr-2 h-4 w-4" />
              Gerar Nota Fiscal
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Exportar como PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    >
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="overview" className="flex-1 sm:flex-none">Visão Geral</TabsTrigger>
          <TabsTrigger value="transactions" className="flex-1 sm:flex-none">Transações</TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1 sm:flex-none">Análises</TabsTrigger>
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
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
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
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
                <CardDescription>De todos os estabelecimentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">
                    {totals.faturamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                </div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" /> +15% em relação ao período anterior
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Receita de Comissões</CardTitle>
                <CardDescription>Comissões do período</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Wallet className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">
                    {totals.taxa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                </div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" /> +12% em relação ao período anterior
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Taxa Média de Comissão</CardTitle>
                <CardDescription>Comissão/Faturamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Percent className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">
                    {totals.faturamento > 0
                      ? ((totals.taxa / totals.faturamento) * 100).toFixed(2) + "%"
                      : "0%"}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
                <CardDescription>Comissões não pagas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">
                    {filteredTransactions
                      .filter(t => t.status === "pendente")
                      .reduce((acc, curr) => acc + curr.taxa, 0)
                      .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                </div>
                <p className="text-xs text-yellow-600 flex items-center mt-1">
                  <ArrowDownUp className="h-3 w-3 mr-1" /> {filteredTransactions.filter(t => t.status === "pendente").length} transações
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Faturamento vs Comissões</CardTitle>
                <CardDescription>Últimos 12 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={revenueData}
                  categories={["faturamento", "comissao"]}
                  colors={["#94A3B8", "#EC4899"]}
                  valueFormatter={(value: number) =>
                    `R$ ${(value / 1000).toFixed(0)}k`
                  }
                  className="aspect-[16/9]"
                />
              </CardContent>
            </Card>
            
            <Card className="md:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Receita por Cidade</CardTitle>
                    <CardDescription>Top cidades no período</CardDescription>
                  </div>
                  <Select
                    value={cityFilter}
                    onValueChange={setCityFilter}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Cidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={revenueCityData.slice(0, 5)}
                  categories={["comissao"]}
                  colors={["#8B5CF6"]}
                  valueFormatter={(value: number) =>
                    `R$ ${(value / 1000).toFixed(0)}k`
                  }
                  className="aspect-[16/9]"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Estabelecimento</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Faturamento</TableHead>
                    <TableHead className="text-right">Taxa/Comissão</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {format(new Date(transaction.data), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>{transaction.estabelecimento}</TableCell>
                        <TableCell>{transaction.cidade}</TableCell>
                        <TableCell className="capitalize">{transaction.tipo}</TableCell>
                        <TableCell className="text-right">
                          {transaction.faturamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {transaction.taxa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColors[transaction.status]}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={handleDownloadInvoice}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                        Nenhuma transação encontrada para o período selecionado.
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredTransactions.length > 0 && (
                    <TableRow className="bg-muted/50 font-medium">
                      <TableCell colSpan={4} className="text-right">
                        Total
                      </TableCell>
                      <TableCell className="text-right">
                        {totals.faturamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                      <TableCell className="text-right">
                        {totals.taxa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                      <TableCell colSpan={2}></TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Taxa Média por Cidade</CardTitle>
                <CardDescription>Porcentagem média aplicada</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cidade</TableHead>
                      <TableHead className="text-right">Taxa Média</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueCityData.map((city) => (
                      <TableRow key={city.name}>
                        <TableCell>{city.name}</TableCell>
                        <TableCell className="text-right">
                          {((city.comissao / city.faturamento) * 100).toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-medium">
                      <TableCell>Média Global</TableCell>
                      <TableCell className="text-right">
                        {((revenueCityData.reduce((acc, city) => acc + city.comissao, 0) / 
                           revenueCityData.reduce((acc, city) => acc + city.faturamento, 0)) * 100).toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Crescimento da Receita</CardTitle>
                <CardDescription>Comparação com período anterior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">Faturamento</span>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold mr-2">+15.8%</span>
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      Crescimento em relação ao período anterior
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">Comissões</span>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold mr-2">+12.3%</span>
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      Crescimento em relação ao período anterior
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">Transações</span>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold mr-2">+18.5%</span>
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      Crescimento em relação ao período anterior
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Status de Pagamentos</CardTitle>
                <CardDescription>Resumo do período selecionado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8 pt-4">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Concluídos</span>
                      <span className="text-sm font-medium text-green-600">
                        {filteredTransactions.filter(t => t.status === "concluido").length}
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div 
                        className="h-2 rounded-full bg-green-500" 
                        style={{ 
                          width: `${filteredTransactions.length ? 
                            (filteredTransactions.filter(t => t.status === "concluido").length / filteredTransactions.length) * 100 : 
                            0}%` 
                        }} 
                      />
                    </div>
                    <span className="mt-1 text-xs text-muted-foreground">
                      {filteredTransactions.filter(t => t.status === "concluido")
                        .reduce((acc, curr) => acc + curr.taxa, 0)
                        .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pendentes</span>
                      <span className="text-sm font-medium text-yellow-600">
                        {filteredTransactions.filter(t => t.status === "pendente").length}
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div 
                        className="h-2 rounded-full bg-yellow-500" 
                        style={{ 
                          width: `${filteredTransactions.length ? 
                            (filteredTransactions.filter(t => t.status === "pendente").length / filteredTransactions.length) * 100 : 
                            0}%` 
                        }} 
                      />
                    </div>
                    <span className="mt-1 text-xs text-muted-foreground">
                      {filteredTransactions.filter(t => t.status === "pendente")
                        .reduce((acc, curr) => acc + curr.taxa, 0)
                        .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cancelados</span>
                      <span className="text-sm font-medium text-red-600">
                        {filteredTransactions.filter(t => t.status === "cancelado").length}
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div 
                        className="h-2 rounded-full bg-red-500" 
                        style={{ 
                          width: `${filteredTransactions.length ? 
                            (filteredTransactions.filter(t => t.status === "cancelado").length / filteredTransactions.length) * 100 : 
                            0}%` 
                        }} 
                      />
                    </div>
                    <span className="mt-1 text-xs text-muted-foreground">
                      {filteredTransactions.filter(t => t.status === "cancelado")
                        .reduce((acc, curr) => acc + curr.taxa, 0)
                        .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
