
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, Filter, Edit, Percent, Calendar,
  Ticket, MoreVertical, X, Check, Store
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

// Dados simulados para cupons
const coupons = [
  {
    id: 1,
    codigo: "BEMVINDO20",
    tipo: "porcentagem",
    valor: 20,
    descricao: "20% de desconto para novos usuários",
    validade: "2025-05-30",
    minCompra: 0,
    maxDesconto: 50,
    estabelecimentos: ["Todos"],
    status: "ativo",
  },
  {
    id: 2,
    codigo: "FRETE10",
    tipo: "fixo",
    valor: 10,
    descricao: "R$ 10 de desconto no frete",
    validade: "2025-04-30",
    minCompra: 30,
    maxDesconto: 10,
    estabelecimentos: ["Burguer King", "Pizza Hut"],
    status: "ativo",
  },
  {
    id: 3,
    codigo: "MEIA15",
    tipo: "porcentagem",
    valor: 15,
    descricao: "15% em pratos selecionados",
    validade: "2025-04-15",
    minCompra: 40,
    maxDesconto: 30,
    estabelecimentos: ["China in Box", "Sushi Temaki"],
    status: "inativo",
  },
  {
    id: 4,
    codigo: "BLACK30",
    tipo: "porcentagem",
    valor: 30,
    descricao: "30% na Black Friday",
    validade: "2025-11-30",
    minCompra: 60,
    maxDesconto: 100,
    estabelecimentos: ["Todos"],
    status: "pendente",
  },
  {
    id: 5,
    codigo: "CASHBACK5",
    tipo: "porcentagem",
    valor: 5,
    descricao: "5% de cashback em qualquer pedido",
    validade: "2025-12-31",
    minCompra: 0,
    maxDesconto: 0,
    estabelecimentos: ["Todos"],
    status: "ativo",
  },
];

// Lista de estabelecimentos
const establishments = [
  "Burguer King",
  "Pizza Hut",
  "China in Box",
  "Outback Steakhouse",
  "Sushi Temaki",
  "Todos"
];

const statusColors: Record<string, string> = {
  ativo: "bg-green-100 text-green-800 hover:bg-green-100",
  inativo: "bg-red-100 text-red-800 hover:bg-red-100",
  pendente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
};

interface CouponFormData {
  id?: number;
  codigo: string;
  tipo: string;
  valor: number;
  descricao: string;
  validade: string;
  minCompra: number;
  maxDesconto: number;
  estabelecimentos: string[];
  status: string;
}

export default function AdminCoupons() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<CouponFormData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  // Função para filtrar cupons
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = 
      coupon.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "todos" || coupon.status === statusFilter;
    const matchesType = typeFilter === "todos" || coupon.tipo === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddCoupon = () => {
    setCurrentCoupon({ 
      codigo: "", 
      tipo: "porcentagem", 
      valor: 0, 
      descricao: "",
      validade: format(new Date().setMonth(new Date().getMonth() + 1), "yyyy-MM-dd"),
      minCompra: 0,
      maxDesconto: 0,
      estabelecimentos: ["Todos"],
      status: "ativo" 
    });
    setSelectedDate(new Date(new Date().setMonth(new Date().getMonth() + 1)));
    setIsAddDialogOpen(true);
  };

  const handleEditCoupon = (coupon: typeof coupons[0]) => {
    setCurrentCoupon({
      id: coupon.id,
      codigo: coupon.codigo,
      tipo: coupon.tipo,
      valor: coupon.valor,
      descricao: coupon.descricao,
      validade: coupon.validade,
      minCompra: coupon.minCompra,
      maxDesconto: coupon.maxDesconto,
      estabelecimentos: [...coupon.estabelecimentos],
      status: coupon.status
    });
    setSelectedDate(new Date(coupon.validade));
    setIsEditDialogOpen(true);
  };

  const handleSaveCoupon = () => {
    if (!currentCoupon) return;
    
    toast({
      title: currentCoupon.id ? "Cupom atualizado!" : "Cupom adicionado!",
      description: `${currentCoupon.codigo} foi ${currentCoupon.id ? "atualizado" : "adicionado"} com sucesso.`,
    });
    
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  };

  const handleToggleStatus = (coupon: typeof coupons[0]) => {
    const newStatus = coupon.status === "ativo" ? "inativo" : "ativo";
    
    toast({
      title: "Status atualizado!",
      description: `${coupon.codigo} agora está ${newStatus}.`,
    });
  };

  // Função para atualizar a data de validade do cupom
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && currentCoupon) {
      setCurrentCoupon({
        ...currentCoupon,
        validade: format(date, "yyyy-MM-dd")
      });
    }
  };

  // Função para atualizar os estabelecimentos
  const handleEstablishmentChange = (value: string) => {
    if (!currentCoupon) return;
    
    let updatedEstablishments: string[];
    
    if (value === "Todos") {
      updatedEstablishments = ["Todos"];
    } else {
      updatedEstablishments = currentCoupon.estabelecimentos.includes("Todos") 
        ? [value] 
        : [...currentCoupon.estabelecimentos.filter(e => e !== "Todos")];
      
      if (updatedEstablishments.includes(value)) {
        updatedEstablishments = updatedEstablishments.filter(e => e !== value);
      } else {
        updatedEstablishments.push(value);
      }
      
      // Se todos os estabelecimentos estão selecionados, simplifica para "Todos"
      if (updatedEstablishments.length === establishments.length - 1) {
        updatedEstablishments = ["Todos"];
      }
      
      // Se não há estabelecimento selecionado, adiciona "Todos"
      if (updatedEstablishments.length === 0) {
        updatedEstablishments = ["Todos"];
      }
    }
    
    setCurrentCoupon({
      ...currentCoupon,
      estabelecimentos: updatedEstablishments
    });
  };

  return (
    <PageLayout 
      title="Cupons e Promoções"
      description="Visualize e gerencie os cupons de desconto e promoções do FomeX."
      actions={
        <Button size="sm" className="bg-fomex-orange hover:bg-fomex-orange/90" onClick={handleAddCoupon}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cupom
        </Button>
      }
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código ou descrição..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-2">
            <div className="flex items-center gap-2 min-w-[180px]">
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
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 min-w-[180px]">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="porcentagem">Porcentagem</SelectItem>
                  <SelectItem value="fixo">Valor Fixo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Estabelecimentos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.length > 0 ? (
                  filteredCoupons.map((coupon) => (
                    <TableRow key={coupon.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center">
                          <Ticket className="h-4 w-4 mr-2 text-fomex-orange" />
                          <span className="font-medium">{coupon.codigo}</span>
                        </div>
                      </TableCell>
                      <TableCell>{coupon.descricao}</TableCell>
                      <TableCell>
                        {coupon.tipo === "porcentagem" 
                          ? <div className="flex items-center"><Percent className="h-4 w-4 mr-1" />{coupon.valor}%</div>
                          : <div>R$ {coupon.valor.toFixed(2).replace('.', ',')}</div>
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          {format(new Date(coupon.validade), "dd/MM/yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Store className="h-4 w-4 mr-1 text-muted-foreground" />
                          {coupon.estabelecimentos.length === 1 && coupon.estabelecimentos[0] === "Todos" 
                            ? "Todos" 
                            : `${coupon.estabelecimentos.length} selecionados`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[coupon.status]}>
                          {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditCoupon(coupon)}>
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(coupon)}>
                              {coupon.status === "ativo" ? (
                                <><X className="mr-2 h-4 w-4" /> Desativar</>
                              ) : (
                                <><Check className="mr-2 h-4 w-4" /> Ativar</>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Nenhum cupom encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Dialog para adicionar cupom */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cupom</DialogTitle>
            <DialogDescription>
              Insira os detalhes para adicionar um novo cupom de desconto.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="coupon-code">Código do Cupom</label>
              <Input
                id="coupon-code"
                value={currentCoupon?.codigo || ""}
                onChange={(e) => setCurrentCoupon(prev => prev ? {...prev, codigo: e.target.value.toUpperCase()} : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="coupon-type">Tipo de Desconto</label>
              <Select
                value={currentCoupon?.tipo || ""}
                onValueChange={(value) => setCurrentCoupon(prev => prev ? {...prev, tipo: value} : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="porcentagem">Porcentagem (%)</SelectItem>
                  <SelectItem value="fixo">Valor Fixo (R$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="coupon-value">
                {currentCoupon?.tipo === "porcentagem" ? "Porcentagem de Desconto" : "Valor do Desconto (R$)"}
              </label>
              <Input
                id="coupon-value"
                type="number"
                value={currentCoupon?.valor || 0}
                onChange={(e) => setCurrentCoupon(prev => prev ? {...prev, valor: Number(e.target.value)} : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="coupon-expires">Data de Validade</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="coupon-min">Valor Mínimo de Compra (R$)</label>
              <Input
                id="coupon-min"
                type="number"
                value={currentCoupon?.minCompra || 0}
                onChange={(e) => setCurrentCoupon(prev => prev ? {...prev, minCompra: Number(e.target.value)} : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="coupon-max">
                {currentCoupon?.tipo === "porcentagem" ? "Desconto Máximo (R$)" : "Desconto Máximo (R$)"}
              </label>
              <Input
                id="coupon-max"
                type="number"
                value={currentCoupon?.maxDesconto || 0}
                onChange={(e) => setCurrentCoupon(prev => prev ? {...prev, maxDesconto: Number(e.target.value)} : null)}
              />
              <p className="text-xs text-muted-foreground">
                {currentCoupon?.tipo === "porcentagem" 
                  ? "0 = sem limite máximo" 
                  : "Geralmente igual ao valor do desconto"}
              </p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="coupon-desc">Descrição</label>
              <Input
                id="coupon-desc"
                value={currentCoupon?.descricao || ""}
                onChange={(e) => setCurrentCoupon(prev => prev ? {...prev, descricao: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Estabelecimentos</label>
              <div className="grid grid-cols-2 gap-2">
                {establishments.map((est) => (
                  <div key={est} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`est-${est}`}
                      checked={currentCoupon?.estabelecimentos.includes(est) || false}
                      onChange={() => handleEstablishmentChange(est)}
                      className="h-4 w-4 rounded border-gray-300 text-fomex-orange focus:ring-fomex-orange"
                    />
                    <label htmlFor={`est-${est}`} className="text-sm">{est}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="coupon-status">Status</label>
              <Select
                value={currentCoupon?.status || ""}
                onValueChange={(value) => setCurrentCoupon(prev => prev ? {...prev, status: value} : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveCoupon} className="bg-fomex-orange hover:bg-fomex-orange/90">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar cupom */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Editar Cupom</DialogTitle>
            <DialogDescription>
              Altere os detalhes do cupom {currentCoupon?.codigo}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="coupon-code-edit">Código do Cupom</label>
              <Input
                id="coupon-code-edit"
                value={currentCoupon?.codigo || ""}
                onChange={(e) => setCurrentCoupon(prev => prev ? {...prev, codigo: e.target.value.toUpperCase()} : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="coupon-type-edit">Tipo de Desconto</label>
              <Select
                value={currentCoupon?.tipo || ""}
                onValueChange={(value) => setCurrentCoupon(prev => prev ? {...prev, tipo: value} : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="porcentagem">Porcentagem (%)</SelectItem>
                  <SelectItem value="fixo">Valor Fixo (R$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="coupon-value-edit">
                {currentCoupon?.tipo === "porcentagem" ? "Porcentagem de Desconto" : "Valor do Desconto (R$)"}
              </label>
              <Input
                id="coupon-value-edit"
                type="number"
                value={currentCoupon?.valor || 0}
                onChange={(e) => setCurrentCoupon(prev => prev ? {...prev, valor: Number(e.target.value)} : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="coupon-expires-edit">Data de Validade</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="coupon-min-edit">Valor Mínimo de Compra (R$)</label>
              <Input
                id="coupon-min-edit"
                type="number"
                value={currentCoupon?.minCompra || 0}
                onChange={(e) => setCurrentCoupon(prev => prev ? {...prev, minCompra: Number(e.target.value)} : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="coupon-max-edit">
                {currentCoupon?.tipo === "porcentagem" ? "Desconto Máximo (R$)" : "Desconto Máximo (R$)"}
              </label>
              <Input
                id="coupon-max-edit"
                type="number"
                value={currentCoupon?.maxDesconto || 0}
                onChange={(e) => setCurrentCoupon(prev => prev ? {...prev, maxDesconto: Number(e.target.value)} : null)}
              />
              <p className="text-xs text-muted-foreground">
                {currentCoupon?.tipo === "porcentagem" 
                  ? "0 = sem limite máximo" 
                  : "Geralmente igual ao valor do desconto"}
              </p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="coupon-desc-edit">Descrição</label>
              <Input
                id="coupon-desc-edit"
                value={currentCoupon?.descricao || ""}
                onChange={(e) => setCurrentCoupon(prev => prev ? {...prev, descricao: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Estabelecimentos</label>
              <div className="grid grid-cols-2 gap-2">
                {establishments.map((est) => (
                  <div key={est} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`est-edit-${est}`}
                      checked={currentCoupon?.estabelecimentos.includes(est) || false}
                      onChange={() => handleEstablishmentChange(est)}
                      className="h-4 w-4 rounded border-gray-300 text-fomex-orange focus:ring-fomex-orange"
                    />
                    <label htmlFor={`est-edit-${est}`} className="text-sm">{est}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="coupon-status-edit">Status</label>
              <Select
                value={currentCoupon?.status || ""}
                onValueChange={(value) => setCurrentCoupon(prev => prev ? {...prev, status: value} : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveCoupon} className="bg-fomex-orange hover:bg-fomex-orange/90">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
