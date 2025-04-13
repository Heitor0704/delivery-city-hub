
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Eye, Edit, Star } from "lucide-react";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const deliverers = [
  {
    id: 1,
    nome: "Carlos Silva",
    telefone: "(11) 99999-8888",
    avaliacao: 4.8,
    status: "ativo",
    veículo: "Moto",
    email: "carlos@entregadores.com",
    cpf: "123.456.789-00",
    cnh: "12345678901",
    placa: "ABC-1234",
    endereco: "Rua das Flores, 123",
    dataCadastro: "2023-02-15",
  },
  {
    id: 2,
    nome: "Marcelo Santos",
    telefone: "(11) 97777-6666",
    avaliacao: 4.5,
    status: "ativo",
    veículo: "Bicicleta",
    email: "marcelo@entregadores.com",
    cpf: "234.567.890-11",
    cnh: "",
    placa: "",
    endereco: "Av. Paulista, 1000",
    dataCadastro: "2023-03-10",
  },
  {
    id: 3,
    nome: "Paulo Oliveira",
    telefone: "(11) 96666-5555",
    avaliacao: 4.7,
    status: "inativo",
    veículo: "Moto",
    email: "paulo@entregadores.com",
    cpf: "345.678.901-22",
    cnh: "23456789012",
    placa: "DEF-5678",
    endereco: "Rua Augusta, 500",
    dataCadastro: "2023-01-20",
  },
  {
    id: 4,
    nome: "Amanda Costa",
    telefone: "(11) 95555-4444",
    avaliacao: 4.9,
    status: "pendente",
    veículo: "Carro",
    email: "amanda@entregadores.com",
    cpf: "456.789.012-33",
    cnh: "34567890123",
    placa: "GHI-9012",
    endereco: "Alameda Santos, 800",
    dataCadastro: "2023-04-05",
  },
  {
    id: 5,
    nome: "Roberto Almeida",
    telefone: "(11) 94444-3333",
    avaliacao: 4.2,
    status: "ativo",
    veículo: "Moto",
    email: "roberto@entregadores.com",
    cpf: "567.890.123-44",
    cnh: "45678901234",
    placa: "JKL-3456",
    endereco: "Rua Consolação, 200",
    dataCadastro: "2023-02-28",
  },
];

const statusColors: Record<string, string> = {
  ativo: "bg-green-100 text-green-800 hover:bg-green-100",
  inativo: "bg-red-100 text-red-800 hover:bg-red-100",
  pendente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
};

// Schema de validação para o formulário
const delivererFormSchema = z.object({
  nome: z.string().min(3, { message: "Nome precisa ter pelo menos 3 caracteres" }),
  telefone: z.string().min(8, { message: "Informe um telefone válido" }),
  email: z.string().email({ message: "Email inválido" }),
  cpf: z.string().min(11, { message: "CPF inválido" }),
  endereco: z.string().min(5, { message: "Endereço precisa ter pelo menos 5 caracteres" }),
  veículo: z.string().min(1, { message: "Selecione um tipo de veículo" }),
  cnh: z.string().optional(),
  placa: z.string().optional(),
  status: z.string().default("pendente"),
});

export default function CityManagerDeliverers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [vehicleFilter, setVehicleFilter] = useState("todos");
  const [isNewDelivererOpen, setIsNewDelivererOpen] = useState(false);
  const [isEditDelivererOpen, setIsEditDelivererOpen] = useState(false);
  const [selectedDeliverer, setSelectedDeliverer] = useState<any | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

  const vehicles = ["Moto", "Bicicleta", "Carro"];

  const form = useForm<z.infer<typeof delivererFormSchema>>({
    resolver: zodResolver(delivererFormSchema),
    defaultValues: {
      nome: "",
      telefone: "",
      email: "",
      cpf: "",
      endereco: "",
      veículo: "",
      cnh: "",
      placa: "",
      status: "pendente",
    },
  });

  const editForm = useForm<z.infer<typeof delivererFormSchema>>({
    resolver: zodResolver(delivererFormSchema),
    defaultValues: {
      nome: "",
      telefone: "",
      email: "",
      cpf: "",
      endereco: "",
      veículo: "",
      cnh: "",
      placa: "",
      status: "pendente",
    },
  });

  const filteredDeliverers = deliverers.filter((deliverer) => {
    const matchesSearch = deliverer.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deliverer.telefone.includes(searchTerm);
    const matchesStatus = statusFilter === "todos" || deliverer.status === statusFilter;
    const matchesVehicle = vehicleFilter === "todos" || deliverer.veículo === vehicleFilter;
    
    return matchesSearch && matchesStatus && matchesVehicle;
  });

  const openNewDelivererDialog = () => {
    form.reset();
    setIsNewDelivererOpen(true);
  };

  const openEditDelivererDialog = (deliverer: any) => {
    setSelectedDeliverer(deliverer);
    editForm.reset({
      nome: deliverer.nome,
      telefone: deliverer.telefone,
      email: deliverer.email,
      cpf: deliverer.cpf,
      endereco: deliverer.endereco,
      veículo: deliverer.veículo,
      cnh: deliverer.cnh,
      placa: deliverer.placa,
      status: deliverer.status,
    });
    setIsEditDelivererOpen(true);
  };

  const viewDelivererDetails = (deliverer: any) => {
    setSelectedDeliverer(deliverer);
    setViewDetailsOpen(true);
  };

  const onSubmitNewDeliverer = (data: z.infer<typeof delivererFormSchema>) => {
    console.log("Novo entregador:", data);
    // Aqui implementaríamos a criação do entregador no backend
    toast({
      title: "Entregador cadastrado",
      description: `${data.nome} foi adicionado com sucesso.`,
    });
    setIsNewDelivererOpen(false);
  };

  const onSubmitEditDeliverer = (data: z.infer<typeof delivererFormSchema>) => {
    if (!selectedDeliverer) return;
    
    console.log("Entregador atualizado:", data);
    // Aqui implementaríamos a atualização do entregador no backend
    toast({
      title: "Entregador atualizado",
      description: `${data.nome} foi atualizado com sucesso.`,
    });
    setIsEditDelivererOpen(false);
  };

  return (
    <PageLayout 
      title="Gerenciar Entregadores"
      description="Visualize e gerencie os entregadores da sua cidade."
      actions={
        <Button 
          size="sm" 
          className="bg-fomex-orange hover:bg-fomex-orange/90"
          onClick={openNewDelivererDialog}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Entregador
        </Button>
      }
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar entregadores por nome ou telefone..."
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
                value={vehicleFilter}
                onValueChange={setVehicleFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por veículo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os veículos</SelectItem>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle} value={vehicle}>{vehicle}</SelectItem>
                  ))}
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
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliverers.length > 0 ? (
                  filteredDeliverers.map((deliverer) => (
                    <TableRow key={deliverer.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{deliverer.nome}</TableCell>
                      <TableCell>{deliverer.telefone}</TableCell>
                      <TableCell>{deliverer.veículo}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          {deliverer.avaliacao}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[deliverer.status]}>
                          {deliverer.status.charAt(0).toUpperCase() + deliverer.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => viewDelivererDetails(deliverer)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openEditDelivererDialog(deliverer)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Nenhum entregador encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal de novo entregador */}
        <Dialog open={isNewDelivererOpen} onOpenChange={setIsNewDelivererOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Novo Entregador</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitNewDeliverer)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(XX) XXXXX-XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input placeholder="XXX.XXX.XXX-XX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="veículo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Veículo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o veículo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vehicles.map((vehicle) => (
                              <SelectItem key={vehicle} value={vehicle}>{vehicle}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="inativo">Inativo</SelectItem>
                            <SelectItem value="pendente">Pendente</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Endereço completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cnh"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNH (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Número da CNH" {...field} />
                        </FormControl>
                        <FormDescription>
                          Obrigatório para moto e carro
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="placa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placa do Veículo (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Placa do veículo" {...field} />
                        </FormControl>
                        <FormDescription>
                          Obrigatório para moto e carro
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsNewDelivererOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Modal de edição de entregador */}
        <Dialog open={isEditDelivererOpen} onOpenChange={setIsEditDelivererOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Entregador</DialogTitle>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onSubmitEditDeliverer)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(XX) XXXXX-XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input placeholder="XXX.XXX.XXX-XX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="veículo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Veículo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o veículo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vehicles.map((vehicle) => (
                              <SelectItem key={vehicle} value={vehicle}>{vehicle}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="inativo">Inativo</SelectItem>
                            <SelectItem value="pendente">Pendente</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={editForm.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Endereço completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="cnh"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNH (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Número da CNH" {...field} />
                        </FormControl>
                        <FormDescription>
                          Obrigatório para moto e carro
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="placa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placa do Veículo (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Placa do veículo" {...field} />
                        </FormControl>
                        <FormDescription>
                          Obrigatório para moto e carro
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditDelivererOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar alterações</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Modal de detalhes do entregador */}
        <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Detalhes do Entregador</DialogTitle>
            </DialogHeader>
            
            {selectedDeliverer && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{selectedDeliverer.nome}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                    <p>{selectedDeliverer.telefone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{selectedDeliverer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">CPF</p>
                    <p>{selectedDeliverer.cpf}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant="outline" className={statusColors[selectedDeliverer.status]}>
                      {selectedDeliverer.status.charAt(0).toUpperCase() + selectedDeliverer.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Veículo</p>
                    <p>{selectedDeliverer.veículo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avaliação</p>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      {selectedDeliverer.avaliacao} / 5
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                    <p>{selectedDeliverer.endereco}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de cadastro</p>
                    <p>{new Date(selectedDeliverer.dataCadastro).toLocaleDateString('pt-BR')}</p>
                  </div>
                  {selectedDeliverer.cnh && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">CNH</p>
                      <p>{selectedDeliverer.cnh}</p>
                    </div>
                  )}
                  {selectedDeliverer.placa && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Placa</p>
                      <p>{selectedDeliverer.placa}</p>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setViewDetailsOpen(false)}
                  >
                    Fechar
                  </Button>
                  <Button 
                    onClick={() => {
                      setViewDetailsOpen(false);
                      openEditDelivererDialog(selectedDeliverer);
                    }}
                  >
                    Editar
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
}
