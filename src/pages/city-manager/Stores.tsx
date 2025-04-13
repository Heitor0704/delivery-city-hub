
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Star, Eye, Edit } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";

const stores = [
  {
    id: 1,
    nome: "Burger King - Centro",
    categoria: "Hambúrgueres",
    avaliacao: 4.8,
    status: "aprovado",
    destaque: true,
    endereco: "Av. Paulista, 1500",
    telefone: "(11) 3333-4444",
    email: "burgerking@exemplo.com",
    cnpj: "12.345.678/0001-90",
    comissao: 10,
  },
  {
    id: 2,
    nome: "Pizza Hut - Shopping",
    categoria: "Pizzas",
    avaliacao: 4.5,
    status: "aprovado",
    destaque: false,
    endereco: "Shopping Central, Loja 42",
    telefone: "(11) 3333-5555",
    email: "pizzahut@exemplo.com",
    cnpj: "23.456.789/0001-12",
    comissao: 12,
  },
  {
    id: 3,
    nome: "Sushi Express",
    categoria: "Japonesa",
    avaliacao: 4.7,
    status: "aprovado",
    destaque: true,
    endereco: "Rua Augusta, 789",
    telefone: "(11) 3333-6666",
    email: "sushi@exemplo.com",
    cnpj: "34.567.890/0001-23",
    comissao: 15,
  },
  {
    id: 4,
    nome: "Padaria São João",
    categoria: "Padarias",
    avaliacao: 4.2,
    status: "pendente",
    destaque: false,
    endereco: "Rua São João, 123",
    telefone: "(11) 3333-7777",
    email: "padaria@exemplo.com",
    cnpj: "45.678.901/0001-34",
    comissao: 8,
  },
  {
    id: 5,
    nome: "China in Box",
    categoria: "Chinesa",
    avaliacao: 4.0,
    status: "rejeitado",
    destaque: false,
    endereco: "Av. Rebouças, 500",
    telefone: "(11) 3333-8888",
    email: "chinainbox@exemplo.com",
    cnpj: "56.789.012/0001-45",
    comissao: 10,
  },
];

const statusColors: Record<string, string> = {
  aprovado: "bg-green-100 text-green-800 hover:bg-green-100",
  pendente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  rejeitado: "bg-red-100 text-red-800 hover:bg-red-100",
};

// Schema de validação para o formulário de estabelecimento
const storeFormSchema = z.object({
  nome: z.string().min(3, { message: "Nome precisa ter pelo menos 3 caracteres" }),
  categoria: z.string().min(1, { message: "Selecione uma categoria" }),
  endereco: z.string().min(5, { message: "Endereço precisa ter pelo menos 5 caracteres" }),
  telefone: z.string().min(8, { message: "Informe um telefone válido" }),
  email: z.string().email({ message: "Email inválido" }),
  cnpj: z.string().min(14, { message: "CNPJ inválido" }),
  comissao: z.coerce.number().min(0).max(100, { message: "Comissão deve estar entre 0 e 100%" }),
  destaque: z.boolean().default(false),
  status: z.string().default("pendente"),
});

export default function CityManagerStores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [isNewStoreOpen, setIsNewStoreOpen] = useState(false);
  const [isEditStoreOpen, setIsEditStoreOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<null | any>(null);
  const [storeDetailsOpen, setStoreDetailsOpen] = useState(false);

  const categories = ["Hambúrgueres", "Pizzas", "Japonesa", "Padarias", "Chinesa", "Brasileira", "Saudável", "Doces", "Bebidas"];

  const form = useForm<z.infer<typeof storeFormSchema>>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      nome: "",
      categoria: "",
      endereco: "",
      telefone: "",
      email: "",
      cnpj: "",
      comissao: 10,
      destaque: false,
      status: "pendente",
    },
  });

  const editForm = useForm<z.infer<typeof storeFormSchema>>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      nome: "",
      categoria: "",
      endereco: "",
      telefone: "",
      email: "",
      cnpj: "",
      comissao: 10,
      destaque: false,
      status: "pendente",
    },
  });

  const filteredStores = stores.filter((store) => {
    const matchesSearch = store.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "todas" || store.categoria === categoryFilter;
    const matchesStatus = statusFilter === "todos" || store.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const openNewStoreDialog = () => {
    form.reset();
    setIsNewStoreOpen(true);
  };

  const openEditStoreDialog = (store: any) => {
    setSelectedStore(store);
    editForm.reset({
      nome: store.nome,
      categoria: store.categoria,
      endereco: store.endereco,
      telefone: store.telefone,
      email: store.email,
      cnpj: store.cnpj,
      comissao: store.comissao,
      destaque: store.destaque,
      status: store.status,
    });
    setIsEditStoreOpen(true);
  };

  const viewStoreDetails = (store: any) => {
    setSelectedStore(store);
    setStoreDetailsOpen(true);
  };

  const onSubmitNewStore = (data: z.infer<typeof storeFormSchema>) => {
    console.log("Novo estabelecimento:", data);
    // Aqui implementaríamos a criação do estabelecimento no backend
    toast({
      title: "Estabelecimento criado",
      description: `${data.nome} foi adicionado com sucesso.`,
    });
    setIsNewStoreOpen(false);
  };

  const onSubmitEditStore = (data: z.infer<typeof storeFormSchema>) => {
    if (!selectedStore) return;
    
    console.log("Estabelecimento atualizado:", data);
    // Aqui implementaríamos a atualização do estabelecimento no backend
    toast({
      title: "Estabelecimento atualizado",
      description: `${data.nome} foi atualizado com sucesso.`,
    });
    setIsEditStoreOpen(false);
  };

  return (
    <PageLayout 
      title="Gerenciar Estabelecimentos"
      description="Visualize e aprove os estabelecimentos da sua cidade."
      actions={
        <Button 
          size="sm" 
          className="bg-fomex-orange hover:bg-fomex-orange/90"
          onClick={openNewStoreDialog}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Estabelecimento
        </Button>
      }
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar estabelecimentos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-2">
            <div className="flex items-center gap-2 min-w-[180px]">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="rejeitado">Rejeitado</SelectItem>
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
                  <TableHead>Estabelecimento</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Destaque</TableHead>
                  <TableHead>Comissão</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStores.length > 0 ? (
                  filteredStores.map((store) => (
                    <TableRow key={store.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{store.nome}</TableCell>
                      <TableCell>{store.categoria}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          {store.avaliacao}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[store.status]}>
                          {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {store.destaque && (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                            Destaque
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{store.comissao}%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => viewStoreDetails(store)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openEditStoreDialog(store)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Nenhum estabelecimento encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal de novo estabelecimento */}
        <Dialog open={isNewStoreOpen} onOpenChange={setIsNewStoreOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Novo Estabelecimento</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitNewStore)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do estabelecimento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="categoria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ</FormLabel>
                        <FormControl>
                          <Input placeholder="XX.XXX.XXX/XXXX-XX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="comissao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comissão (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} />
                        </FormControl>
                        <FormDescription>
                          Porcentagem cobrada sobre cada pedido
                        </FormDescription>
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
                          <SelectItem value="aprovado">Aprovado</SelectItem>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="rejeitado">Rejeitado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="destaque"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Estabelecimento em Destaque</FormLabel>
                        <FormDescription>
                          Mostrar este estabelecimento em destaque na aplicação
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsNewStoreOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Modal de edição de estabelecimento */}
        <Dialog open={isEditStoreOpen} onOpenChange={setIsEditStoreOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Estabelecimento</DialogTitle>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onSubmitEditStore)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do estabelecimento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="categoria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ</FormLabel>
                        <FormControl>
                          <Input placeholder="XX.XXX.XXX/XXXX-XX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="comissao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comissão (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} />
                        </FormControl>
                        <FormDescription>
                          Porcentagem cobrada sobre cada pedido
                        </FormDescription>
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
                          <SelectItem value="aprovado">Aprovado</SelectItem>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="rejeitado">Rejeitado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="destaque"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Estabelecimento em Destaque</FormLabel>
                        <FormDescription>
                          Mostrar este estabelecimento em destaque na aplicação
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditStoreOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar alterações</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Modal de detalhes do estabelecimento */}
        <Dialog open={storeDetailsOpen} onOpenChange={setStoreDetailsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Detalhes do Estabelecimento</DialogTitle>
            </DialogHeader>
            
            {selectedStore && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{selectedStore.nome}</h3>
                  <p className="text-sm text-muted-foreground">{selectedStore.categoria}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                    <p>{selectedStore.endereco}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                    <p>{selectedStore.telefone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{selectedStore.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">CNPJ</p>
                    <p>{selectedStore.cnpj}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant="outline" className={statusColors[selectedStore.status]}>
                      {selectedStore.status.charAt(0).toUpperCase() + selectedStore.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avaliação</p>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      {selectedStore.avaliacao} / 5
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Comissão</p>
                    <p>{selectedStore.comissao}% por pedido</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Destaque</p>
                    <p>{selectedStore.destaque ? "Sim" : "Não"}</p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setStoreDetailsOpen(false)}
                  >
                    Fechar
                  </Button>
                  <Button 
                    onClick={() => {
                      setStoreDetailsOpen(false);
                      openEditStoreDialog(selectedStore);
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
