
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, Filter, Eye, Edit, X, Check,
  MapPin, Phone, Store, MoreVertical
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// Dados simulados para estabelecimentos
const establishments = [
  {
    id: 1,
    nome: "Burguer King",
    categoria: "Fast Food",
    telefone: "(11) 3333-4444",
    endereco: "Av. Paulista, 1000",
    cidade: "São Paulo",
    estado: "SP",
    status: "ativo",
  },
  {
    id: 2,
    nome: "Pizza Hut",
    categoria: "Pizzaria",
    telefone: "(11) 3333-5555",
    endereco: "Rua Augusta, 500",
    cidade: "São Paulo",
    estado: "SP",
    status: "ativo",
  },
  {
    id: 3,
    nome: "China in Box",
    categoria: "Asiática",
    telefone: "(21) 3333-6666",
    endereco: "Rua Copacabana, 200",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    status: "ativo",
  },
  {
    id: 4,
    nome: "Outback Steakhouse",
    categoria: "Churrascaria",
    telefone: "(31) 3333-7777",
    endereco: "Av. Afonso Pena, 1500",
    cidade: "Belo Horizonte",
    estado: "MG",
    status: "inativo",
  },
  {
    id: 5,
    nome: "Sushi Temaki",
    categoria: "Japonesa",
    telefone: "(41) 3333-8888",
    endereco: "Rua Batel, 300",
    cidade: "Curitiba",
    estado: "PR",
    status: "ativo",
  },
];

// Lista de categorias
const categories = [
  "Fast Food",
  "Pizzaria",
  "Asiática",
  "Japonesa",
  "Churrascaria",
  "Brasileira",
  "Italiana",
  "Árabe",
  "Mexicana",
  "Vegana"
];

// Lista de cidades disponíveis
const availableCities = [
  { id: 1, nome: "São Paulo", estado: "SP" },
  { id: 2, nome: "Rio de Janeiro", estado: "RJ" },
  { id: 3, nome: "Belo Horizonte", estado: "MG" },
  { id: 4, nome: "Curitiba", estado: "PR" },
  { id: 5, nome: "Salvador", estado: "BA" },
];

const statusColors: Record<string, string> = {
  ativo: "bg-green-100 text-green-800 hover:bg-green-100",
  inativo: "bg-red-100 text-red-800 hover:bg-red-100",
  pendente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
};

interface EstablishmentFormData {
  id?: number;
  nome: string;
  categoria: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  status: string;
}

export default function AdminCompanies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentEstablishment, setCurrentEstablishment] = useState<EstablishmentFormData | null>(null);
  const { toast } = useToast();

  // Função para filtrar estabelecimentos
  const filteredEstablishments = establishments.filter((est) => {
    const matchesSearch = 
      est.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.endereco.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "todos" || est.status === statusFilter;
    const matchesCategory = categoryFilter === "todas" || est.categoria === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAddEstablishment = () => {
    setCurrentEstablishment({ 
      nome: "", 
      categoria: "", 
      telefone: "", 
      endereco: "",
      cidade: "", 
      estado: "", 
      status: "ativo" 
    });
    setIsAddDialogOpen(true);
  };

  const handleEditEstablishment = (est: typeof establishments[0]) => {
    setCurrentEstablishment({
      id: est.id,
      nome: est.nome,
      categoria: est.categoria,
      telefone: est.telefone,
      endereco: est.endereco,
      cidade: est.cidade,
      estado: est.estado,
      status: est.status
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEstablishment = () => {
    if (!currentEstablishment) return;
    
    toast({
      title: currentEstablishment.id ? "Estabelecimento atualizado!" : "Estabelecimento adicionado!",
      description: `${currentEstablishment.nome} foi ${currentEstablishment.id ? "atualizado" : "adicionado"} com sucesso.`,
    });
    
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  };

  const handleToggleStatus = (est: typeof establishments[0]) => {
    const newStatus = est.status === "ativo" ? "inativo" : "ativo";
    
    toast({
      title: "Status atualizado!",
      description: `${est.nome} agora está ${newStatus}.`,
    });
  };

  // Função para atualizar a cidade e estado no formulário
  const handleCityChange = (cityId: string) => {
    const city = availableCities.find(c => c.id === parseInt(cityId));
    if (city && currentEstablishment) {
      setCurrentEstablishment({
        ...currentEstablishment,
        cidade: city.nome,
        estado: city.estado
      });
    }
  };

  return (
    <PageLayout 
      title="Gerenciar Estabelecimentos"
      description="Visualize e gerencie os estabelecimentos da plataforma FomeX."
      actions={
        <Button size="sm" className="bg-fomex-orange hover:bg-fomex-orange/90" onClick={handleAddEstablishment}>
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
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estabelecimento</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEstablishments.length > 0 ? (
                  filteredEstablishments.map((est) => (
                    <TableRow key={est.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center">
                          <Store className="h-4 w-4 mr-2 text-fomex-orange" />
                          <span className="font-medium">{est.nome}</span>
                        </div>
                      </TableCell>
                      <TableCell>{est.categoria}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
                          {est.telefone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          {est.cidade}/{est.estado}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[est.status]}>
                          {est.status.charAt(0).toUpperCase() + est.status.slice(1)}
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
                            <DropdownMenuItem onClick={() => handleEditEstablishment(est)}>
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(est)}>
                              {est.status === "ativo" ? (
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
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Nenhum estabelecimento encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Dialog para adicionar estabelecimento */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Estabelecimento</DialogTitle>
            <DialogDescription>
              Insira os detalhes para adicionar um novo estabelecimento ao sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="est-name">Nome do Estabelecimento</label>
              <Input
                id="est-name"
                value={currentEstablishment?.nome || ""}
                onChange={(e) => setCurrentEstablishment(prev => prev ? {...prev, nome: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="est-category">Categoria</label>
              <Select
                value={currentEstablishment?.categoria || ""}
                onValueChange={(value) => setCurrentEstablishment(prev => prev ? {...prev, categoria: value} : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="est-phone">Telefone</label>
              <Input
                id="est-phone"
                value={currentEstablishment?.telefone || ""}
                onChange={(e) => setCurrentEstablishment(prev => prev ? {...prev, telefone: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="est-address">Endereço</label>
              <Input
                id="est-address"
                value={currentEstablishment?.endereco || ""}
                onChange={(e) => setCurrentEstablishment(prev => prev ? {...prev, endereco: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="est-city">Cidade</label>
              <Select
                value={currentEstablishment?.cidade ? 
                  String(availableCities.find(c => c.nome === currentEstablishment.cidade)?.id || "") : 
                  ""}
                onValueChange={handleCityChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma cidade" />
                </SelectTrigger>
                <SelectContent>
                  {availableCities.map((city) => (
                    <SelectItem key={city.id} value={String(city.id)}>
                      {city.nome}/{city.estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="est-status">Status</label>
              <Select
                value={currentEstablishment?.status || ""}
                onValueChange={(value) => setCurrentEstablishment(prev => prev ? {...prev, status: value} : null)}
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
            <Button onClick={handleSaveEstablishment} className="bg-fomex-orange hover:bg-fomex-orange/90">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar estabelecimento */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Estabelecimento</DialogTitle>
            <DialogDescription>
              Altere os detalhes do estabelecimento {currentEstablishment?.nome}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="est-name-edit">Nome do Estabelecimento</label>
              <Input
                id="est-name-edit"
                value={currentEstablishment?.nome || ""}
                onChange={(e) => setCurrentEstablishment(prev => prev ? {...prev, nome: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="est-category-edit">Categoria</label>
              <Select
                value={currentEstablishment?.categoria || ""}
                onValueChange={(value) => setCurrentEstablishment(prev => prev ? {...prev, categoria: value} : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="est-phone-edit">Telefone</label>
              <Input
                id="est-phone-edit"
                value={currentEstablishment?.telefone || ""}
                onChange={(e) => setCurrentEstablishment(prev => prev ? {...prev, telefone: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="est-address-edit">Endereço</label>
              <Input
                id="est-address-edit"
                value={currentEstablishment?.endereco || ""}
                onChange={(e) => setCurrentEstablishment(prev => prev ? {...prev, endereco: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="est-city-edit">Cidade</label>
              <Select
                value={currentEstablishment?.cidade ? 
                  String(availableCities.find(c => c.nome === currentEstablishment.cidade)?.id || "") : 
                  ""}
                onValueChange={handleCityChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma cidade" />
                </SelectTrigger>
                <SelectContent>
                  {availableCities.map((city) => (
                    <SelectItem key={city.id} value={String(city.id)}>
                      {city.nome}/{city.estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="est-status-edit">Status</label>
              <Select
                value={currentEstablishment?.status || ""}
                onValueChange={(value) => setCurrentEstablishment(prev => prev ? {...prev, status: value} : null)}
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
            <Button onClick={handleSaveEstablishment} className="bg-fomex-orange hover:bg-fomex-orange/90">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
