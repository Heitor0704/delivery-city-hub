
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { LineChart } from "@/components/ui/chart";
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
import { DateRange } from "react-day-picker";
import { 
  Calendar as CalendarIcon, 
  ChevronDown, 
  Download, 
  Filter, 
  Printer, 
  DownloadCloud
} from "lucide-react";
import { addDays, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

// Dados simulados para o relatório financeiro
const financialData = [
  {
    id: 1,
    data: "2023-04-01",
    pedidos: 32,
    valor: "R$ 1.256,80",
    taxaEntrega: "R$ 160,00",
    comissao: "R$ 125,68",
    liquido: "R$ 1.291,12",
  },
  {
    id: 2,
    data: "2023-04-02",
    pedidos: 28,
    valor: "R$ 1.105,40",
    taxaEntrega: "R$ 140,00",
    comissao: "R$ 110,54",
    liquido: "R$ 1.134,86",
  },
  {
    id: 3,
    data: "2023-04-03",
    pedidos: 35,
    valor: "R$ 1.378,90",
    taxaEntrega: "R$ 175,00",
    comissao: "R$ 137,89",
    liquido: "R$ 1.416,01",
  },
  {
    id: 4,
    data: "2023-04-04",
    pedidos: 30,
    valor: "R$ 1.187,50",
    taxaEntrega: "R$ 150,00",
    comissao: "R$ 118,75",
    liquido: "R$ 1.218,75",
  },
  {
    id: 5,
    data: "2023-04-05",
    pedidos: 42,
    valor: "R$ 1.658,70",
    taxaEntrega: "R$ 210,00",
    comissao: "R$ 165,87",
    liquido: "R$ 1.702,83",
  },
  {
    id: 6,
    data: "2023-04-06",
    pedidos: 38,
    valor: "R$ 1.489,20",
    taxaEntrega: "R$ 190,00",
    comissao: "R$ 148,92",
    liquido: "R$ 1.530,28",
  },
  {
    id: 7,
    data: "2023-04-07",
    pedidos: 45,
    valor: "R$ 1.782,30",
    taxaEntrega: "R$ 225,00",
    comissao: "R$ 178,23",
    liquido: "R$ 1.829,07",
  },
];

// Função para formatar data para o gráfico
const parseDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return format(new Date(year, month - 1, day), "dd/MM");
};

// Dados para o gráfico
const chartData = financialData.map((day) => ({
  name: parseDate(day.data),
  total: parseFloat(day.valor.replace('R$ ', '').replace('.', '').replace(',', '.')),
  liquido: parseFloat(day.liquido.replace('R$ ', '').replace('.', '').replace(',', '.')),
}));

export default function OwnerPayments() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfWeek(new Date()),
    to: endOfWeek(new Date())
  });
  const [filterPeriod, setFilterPeriod] = useState("week");
  
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

  const filteredData = financialData.filter((day) => {
    if (!date?.from) return true;
    
    const dayDate = new Date(day.data);
    
    if (date.to) {
      return isWithinInterval(dayDate, { start: date.from, end: date.to });
    }
    
    return format(dayDate, 'yyyy-MM-dd') === format(date.from, 'yyyy-MM-dd');
  });
  
  const totals = filteredData.reduce((acc, curr) => {
    return {
      pedidos: acc.pedidos + curr.pedidos,
      valor: acc.valor + parseFloat(curr.valor.replace('R$ ', '').replace('.', '').replace(',', '.')),
      taxaEntrega: acc.taxaEntrega + parseFloat(curr.taxaEntrega.replace('R$ ', '').replace('.', '').replace(',', '.')),
      comissao: acc.comissao + parseFloat(curr.comissao.replace('R$ ', '').replace('.', '').replace(',', '.')),
      liquido: acc.liquido + parseFloat(curr.liquido.replace('R$ ', '').replace('.', '').replace(',', '.'))
    };
  }, { pedidos: 0, valor: 0, taxaEntrega: 0, comissao: 0, liquido: 0 });

  const dateRangeText = () => {
    if (!date?.from) return "Selecione um período";
    
    if (date.to) {
      return `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`;
    }
    return format(date.from, "dd/MM/yyyy");
  };

  return (
    <PageLayout 
      title="Financeiro"
      description="Acompanhe seus pagamentos e transações financeiras."
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
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Exportar como PDF
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Exportar como Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    >
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="summary" className="flex-1 md:flex-none">Resumo</TabsTrigger>
          <TabsTrigger value="transactions" className="flex-1 md:flex-none">Transações</TabsTrigger>
          <TabsTrigger value="reports" className="flex-1 md:flex-none">Relatórios</TabsTrigger>
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
        
        <TabsContent value="summary">
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2 md:pb-2">
                <CardTitle className="text-sm font-medium">Total Bruto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {`R$ ${totals.valor.toFixed(2).replace('.', ',')}`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {totals.pedidos} pedidos
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 md:pb-2">
                <CardTitle className="text-sm font-medium">Taxas de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {`R$ ${totals.taxaEntrega.toFixed(2).replace('.', ',')}`}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 md:pb-2">
                <CardTitle className="text-sm font-medium">Comissão FomeX</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  -R$ {totals.comissao.toFixed(2).replace('.', ',')}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 md:pb-2">
                <CardTitle className="text-sm font-medium">Valor Líquido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R$ {totals.liquido.toFixed(2).replace('.', ',')}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Faturamento por Dia</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={chartData}
                categories={["total", "liquido"]}
                colors={["#E53935", "#43A047"]}
                valueFormatter={(value: number) =>
                  `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                }
                className="aspect-[4/2]"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Pedidos</TableHead>
                    <TableHead>Valor Bruto</TableHead>
                    <TableHead>Taxas de Entrega</TableHead>
                    <TableHead>Comissão</TableHead>
                    <TableHead>Valor Líquido</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((day) => (
                    <TableRow key={day.id}>
                      <TableCell>
                        {format(new Date(day.data), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>{day.pedidos}</TableCell>
                      <TableCell>{day.valor}</TableCell>
                      <TableCell>{day.taxaEntrega}</TableCell>
                      <TableCell className="text-red-500">-{day.comissao}</TableCell>
                      <TableCell className="font-medium">{day.liquido}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="font-bold">{totals.pedidos}</TableCell>
                    <TableCell className="font-bold">
                      R$ {totals.valor.toFixed(2).replace('.', ',')}
                    </TableCell>
                    <TableCell className="font-bold">
                      R$ {totals.taxaEntrega.toFixed(2).replace('.', ',')}
                    </TableCell>
                    <TableCell className="font-bold text-red-500">
                      -R$ {totals.comissao.toFixed(2).replace('.', ',')}
                    </TableCell>
                    <TableCell className="font-bold">
                      R$ {totals.liquido.toFixed(2).replace('.', ',')}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:border-fomex-orange hover:shadow-md transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Relatório de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Relatório detalhado com todas as vendas do período.
                </p>
                <Button variant="outline" className="w-full">
                  <Printer className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:border-fomex-orange hover:shadow-md transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Relatório de Produtos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Vendas detalhadas por produto com quantidades e valores.
                </p>
                <Button variant="outline" className="w-full">
                  <Printer className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:border-fomex-orange hover:shadow-md transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Relatório de Entregadores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Análise de entregas por entregador e taxa de comissão.
                </p>
                <Button variant="outline" className="w-full">
                  <Printer className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
