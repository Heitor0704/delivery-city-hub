
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Calendar, ArrowRight, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { BarChart, LineChart } from "@/components/ui/chart";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Dados simulados de comissões
const commissions = [
  {
    id: 1,
    estabelecimento: "Burger King - Centro",
    mes: "Abril 2023",
    valor: 1250.75,
    status: "pago",
    dataPagamento: "2023-04-10",
    detalhes: [
      { semana: "Semana 1", pedidos: 182, valor: 290.50 },
      { semana: "Semana 2", pedidos: 195, valor: 312.75 },
      { semana: "Semana 3", pedidos: 208, valor: 325.80 },
      { semana: "Semana 4", pedidos: 175, valor: 321.70 },
    ]
  },
  {
    id: 2,
    estabelecimento: "Pizza Hut - Shopping",
    mes: "Abril 2023",
    valor: 980.30,
    status: "pago",
    dataPagamento: "2023-04-12",
    detalhes: [
      { semana: "Semana 1", pedidos: 110, valor: 210.40 },
      { semana: "Semana 2", pedidos: 135, valor: 258.70 },
      { semana: "Semana 3", pedidos: 142, valor: 272.10 },
      { semana: "Semana 4", pedidos: 120, valor: 239.10 },
    ]
  },
  {
    id: 3,
    estabelecimento: "Sushi Express",
    mes: "Abril 2023",
    valor: 1420.80,
    status: "pendente",
    dataPagamento: null,
    detalhes: [
      { semana: "Semana 1", pedidos: 95, valor: 320.30 },
      { semana: "Semana 2", pedidos: 112, valor: 378.50 },
      { semana: "Semana 3", pedidos: 105, valor: 350.80 },
      { semana: "Semana 4", pedidos: 110, valor: 371.20 },
    ]
  },
  {
    id: 4,
    estabelecimento: "Padaria São João",
    mes: "Abril 2023",
    valor: 560.25,
    status: "pago",
    dataPagamento: "2023-04-08",
    detalhes: [
      { semana: "Semana 1", pedidos: 75, valor: 130.20 },
      { semana: "Semana 2", pedidos: 82, valor: 142.50 },
      { semana: "Semana 3", pedidos: 78, valor: 135.30 },
      { semana: "Semana 4", pedidos: 80, valor: 152.25 },
    ]
  },
  {
    id: 5,
    estabelecimento: "China in Box",
    mes: "Abril 2023",
    valor: 840.15,
    status: "atrasado",
    dataPagamento: null,
    detalhes: [
      { semana: "Semana 1", pedidos: 88, valor: 190.40 },
      { semana: "Semana 2", pedidos: 95, valor: 210.30 },
      { semana: "Semana 3", pedidos: 102, valor: 225.60 },
      { semana: "Semana 4", pedidos: 90, valor: 213.85 },
    ]
  },
];

// Dados simulados para gráficos
const monthlyCommissionData = [
  { name: "Jan", comissões: 5200 },
  { name: "Fev", comissões: 4800 },
  { name: "Mar", comissões: 6100 },
  { name: "Abr", comissões: 5900 },
  { name: "Mai", comissões: 6800 },
  { name: "Jun", comissões: 7200 },
  { name: "Jul", comissões: 8500 },
];

const storePerformanceData = [
  { name: "Burger King", vendas: 1250.75 },
  { name: "Pizza Hut", vendas: 980.30 },
  { name: "Sushi Express", vendas: 1420.80 },
  { name: "Padaria São João", vendas: 560.25 },
  { name: "China in Box", vendas: 840.15 },
];

const statusColors: Record<string, string> = {
  pago: "bg-green-100 text-green-800 hover:bg-green-100",
  pendente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  atrasado: "bg-red-100 text-red-800 hover:bg-red-100",
};

export default function CityManagerCommissions() {
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selectedCommission, setSelectedCommission] = useState<any | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

  const filteredCommissions = commissions.filter((commission) =>
    statusFilter === "todos" || commission.status === statusFilter
  );

  const totalCommission = commissions.reduce((sum, commission) => sum + commission.valor, 0);
  const pendingCommission = commissions
    .filter(commission => commission.status === "pendente" || commission.status === "atrasado")
    .reduce((sum, commission) => sum + commission.valor, 0);
  const paidCommission = commissions
    .filter(commission => commission.status === "pago")
    .reduce((sum, commission) => sum + commission.valor, 0);

  const viewCommissionDetails = (commission: any) => {
    setSelectedCommission(commission);
    setViewDetailsOpen(true);
  };

  return (
    <PageLayout 
      title="Financeiro"
      description="Visualize as comissões e finanças da sua cidade."
    >
      <div className="flex flex-col space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Comissões</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalCommission)}
              </div>
              <p className="text-xs text-muted-foreground">
                +15% em relação ao mês anterior
              </p>
              <div className="mt-4 h-1 w-full bg-gray-200 rounded-full">
                <div className="h-1 bg-green-500 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Comissões Recebidas</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(paidCommission)}
              </div>
              <p className="text-xs text-muted-foreground">
                {((paidCommission / totalCommission) * 100).toFixed(1)}% do total
              </p>
              <div className="mt-4 h-1 w-full bg-gray-200 rounded-full">
                <div 
                  className="h-1 bg-green-500 rounded-full" 
                  style={{ width: `${(paidCommission / totalCommission) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Comissões Pendentes</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(pendingCommission)}
              </div>
              <p className="text-xs text-muted-foreground">
                {((pendingCommission / totalCommission) * 100).toFixed(1)}% do total
              </p>
              <div className="mt-4 h-1 w-full bg-gray-200 rounded-full">
                <div 
                  className="h-1 bg-yellow-500 rounded-full" 
                  style={{ width: `${(pendingCommission / totalCommission) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="commissions">
          <TabsList>
            <TabsTrigger value="commissions">Comissões</TabsTrigger>
            <TabsTrigger value="charts">Gráficos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="commissions" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os status</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="atrasado">Atrasado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar Relatório
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estabelecimento</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data Pagamento</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCommissions.length > 0 ? (
                      filteredCommissions.map((commission) => (
                        <TableRow key={commission.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{commission.estabelecimento}</TableCell>
                          <TableCell>{commission.mes}</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(commission.valor)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusColors[commission.status]}>
                              {commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {commission.dataPagamento 
                              ? new Date(commission.dataPagamento).toLocaleDateString('pt-BR') 
                              : "-"
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => viewCommissionDetails(commission)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          Nenhuma comissão encontrada com os filtros selecionados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="charts" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Comissões Mensais</CardTitle>
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
              
              <Card>
                <CardHeader>
                  <CardTitle>Desempenho dos Estabelecimentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={storePerformanceData}
                    categories={["vendas"]}
                    colors={["#E53935"]}
                    valueFormatter={(value: number) =>
                      `R$ ${value.toLocaleString("pt-BR")}`
                    }
                    className="aspect-[4/3]"
                  />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Distribuição das Comissões por Estabelecimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {commissions.map((commission) => (
                    <div key={commission.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="font-medium">{commission.estabelecimento}</span>
                        </div>
                        <span className="text-sm">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(commission.valor)}
                        </span>
                      </div>
                      <Progress value={(commission.valor / totalCommission) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de detalhes da comissão */}
        <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Detalhes da Comissão</DialogTitle>
            </DialogHeader>
            
            {selectedCommission && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="text-lg font-semibold">{selectedCommission.estabelecimento}</h3>
                  <Badge variant="outline" className={statusColors[selectedCommission.status]}>
                    {selectedCommission.status.charAt(0).toUpperCase() + selectedCommission.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Período</p>
                    <p className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {selectedCommission.mes}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total</p>
                    <p className="text-lg font-bold text-green-600">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(selectedCommission.valor)}
                    </p>
                  </div>
                  
                  {selectedCommission.dataPagamento && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Data de Pagamento</p>
                        <p>{new Date(selectedCommission.dataPagamento).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Método de Pagamento</p>
                        <p>Transferência Bancária</p>
                      </div>
                    </>
                  )}
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Detalhamento Semanal</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Período</TableHead>
                        <TableHead>Pedidos</TableHead>
                        <TableHead className="text-right">Comissão</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCommission.detalhes.map((detalhe: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{detalhe.semana}</TableCell>
                          <TableCell>{detalhe.pedidos}</TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(detalhe.valor)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setViewDetailsOpen(false)}
                  >
                    Fechar
                  </Button>
                  {selectedCommission.status !== "pago" && (
                    <Button>
                      Marcar como Pago
                    </Button>
                  )}
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
}
