
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, Filter, Eye, Edit, X, Check,
  Map, MoreVertical, UserCheck 
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

// Dados simulados para gerentes
const managers = [
  {
    id: 1,
    nome: "Ana Silva",
    email: "ana.silva@fomex.com",
    telefone: "(11) 99999-1234",
    cidade: "São Paulo",
    estado: "SP",
    status: "ativo",
  },
  {
    id: 2,
    nome: "João Santos",
    email: "joao.santos@fomex.com",
    telefone: "(21) 98888-5678",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    status: "ativo",
  },
  {
    id: 3,
    nome: "Carlos Mendes",
    email: "carlos.mendes@fomex.com",
    telefone: "(31) 97777-9012",
    cidade: "Belo Horizonte",
    estado: "MG",
    status: "ativo",
  },
  {
    id: 4,
    nome: "Paula Ferreira",
    email: "paula.ferreira@fomex.com",
    telefone: "(41) 96666-3456",
    cidade: "Curitiba",
    estado: "PR",
    status: "inativo",
  },
  {
    id: 5,
    nome: "Roberto Costa",
    email: "roberto.costa@fomex.com",
    telefone: "(71) 95555-7890",
    cidade: "Salvador",
    estado: "BA",
    status: "ativo",
  },
];

// Lista de cidades disponíveis
const availableCities = [
  { id: 1, nome: "São Paulo", estado: "SP" },
  { id: 2, nome: "Rio de Janeiro", estado: "RJ" },
  { id: 3, nome: "Belo Horizonte", estado: "MG" },
  { id: 4, nome: "Curitiba", estado: "PR" },
  { id: 5, nome: "Salvador", estado: "BA" },
  { id: 6, nome: "Fortaleza", estado: "CE" },
  { id: 7, nome: "Recife", estado: "PE" },
  { id: 8, nome: "Brasília", estado: "DF" },
];

const statusColors: Record<string, string> = {
  ativo: "bg-green-100 text-green-800 hover:bg-green-100",
  inativo: "bg-red-100 text-red-800 hover:bg-red-100",
  pendente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
};

interface ManagerFormData {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  status: string;
}

export default function AdminManagers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentManager, setCurrentManager] = useState<ManagerFormData | null>(null);
  const { toast } = useToast();

  const filteredManagers = managers.filter((manager) => {
    const matchesSearch = 
      manager.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.cidade.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "todos" || manager.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddManager = () => {
    setCurrentManager({ 
      nome: "", 
      email: "", 
      telefone: "", 
      cidade: "", 
      estado: "", 
      status: "ativo" 
    });
    setIsAddDialogOpen(true);
  };

  const handleEditManager = (manager: typeof managers[0]) => {
    setCurrentManager({
      id: manager.id,
      nome: manager.nome,
      email: manager.email,
      telefone: manager.telefone,
      cidade: manager.cidade,
      estado: manager.estado,
      status: manager.status
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveManager = () => {
    if (!currentManager) return;
    
    toast({
      title: currentManager.id ? "Gerente atualizado!" : "Gerente adicionado!",
      description: `${currentManager.nome} foi ${currentManager.id ? "atualizado" : "adicionado"} com sucesso.`,
    });
    
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  };

  const handleToggleStatus = (manager: typeof managers[0]) => {
    const newStatus = manager.status === "ativo" ? "inativo" : "ativo";
    
    toast({
      title: "Status atualizado!",
      description: `${manager.nome} agora está ${newStatus}.`,
    });
  };

  // Função para atualizar a cidade e estado no formulário
  const handleCityChange = (cityId: string) => {
    const city = availableCities.find(c => c.id === parseInt(cityId));
    if (city && currentManager) {
      setCurrentManager({
        ...currentManager,
        cidade: city.nome,
        estado: city.estado
      });
    }
  };

  return (
    <PageLayout 
      title="Gerenciar Gerentes"
      description="Visualize e gerencie os gerentes de cidade do FomeX."
      actions={
        <Button size="sm" className="bg-fomex-orange hover:bg-fomex-orange/90" onClick={handleAddManager}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Gerente
        </Button>
      }
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar gerentes por nome, email ou cidade..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Cidade/UF</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredManagers.length > 0 ? (
                  filteredManagers.map((manager) => (
                    <TableRow key={manager.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{manager.nome}</TableCell>
                      <TableCell>{manager.email}</TableCell>
                      <TableCell>{manager.telefone}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Map className="h-4 w-4 mr-1 text-fomex-orange" />
                          {manager.cidade}/{manager.estado}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[manager.status]}>
                          {manager.status.charAt(0).toUpperCase() + manager.status.slice(1)}
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
                            <DropdownMenuItem onClick={() => handleEditManager(manager)}>
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(manager)}>
                              {manager.status === "ativo" ? (
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
                      Nenhum gerente encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Dialog para adicionar gerente */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Gerente</DialogTitle>
            <DialogDescription>
              Insira os detalhes para adicionar um novo gerente ao sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="manager-name">Nome Completo</label>
              <Input
                id="manager-name"
                value={currentManager?.nome || ""}
                onChange={(e) => setCurrentManager(prev => prev ? {...prev, nome: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="manager-email">Email</label>
              <Input
                id="manager-email"
                type="email"
                value={currentManager?.email || ""}
                onChange={(e) => setCurrentManager(prev => prev ? {...prev, email: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="manager-phone">Telefone</label>
              <Input
                id="manager-phone"
                value={currentManager?.telefone || ""}
                onChange={(e) => setCurrentManager(prev => prev ? {...prev, telefone: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="manager-city">Cidade</label>
              <Select
                value={currentManager?.cidade ? 
                  String(availableCities.find(c => c.nome === currentManager.cidade)?.id || "") : 
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
              <label className="text-sm font-medium" htmlFor="manager-status">Status</label>
              <Select
                value={currentManager?.status || ""}
                onValueChange={(value) => setCurrentManager(prev => prev ? {...prev, status: value} : null)}
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
            <Button onClick={handleSaveManager} className="bg-fomex-orange hover:bg-fomex-orange/90">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar gerente */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Gerente</DialogTitle>
            <DialogDescription>
              Altere os detalhes do gerente {currentManager?.nome}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="manager-name-edit">Nome Completo</label>
              <Input
                id="manager-name-edit"
                value={currentManager?.nome || ""}
                onChange={(e) => setCurrentManager(prev => prev ? {...prev, nome: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="manager-email-edit">Email</label>
              <Input
                id="manager-email-edit"
                type="email"
                value={currentManager?.email || ""}
                onChange={(e) => setCurrentManager(prev => prev ? {...prev, email: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="manager-phone-edit">Telefone</label>
              <Input
                id="manager-phone-edit"
                value={currentManager?.telefone || ""}
                onChange={(e) => setCurrentManager(prev => prev ? {...prev, telefone: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="manager-city-edit">Cidade</label>
              <Select
                value={currentManager?.cidade ? 
                  String(availableCities.find(c => c.nome === currentManager.cidade)?.id || "") : 
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
              <label className="text-sm font-medium" htmlFor="manager-status-edit">Status</label>
              <Select
                value={currentManager?.status || ""}
                onValueChange={(value) => setCurrentManager(prev => prev ? {...prev, status: value} : null)}
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
            <Button onClick={handleSaveManager} className="bg-fomex-orange hover:bg-fomex-orange/90">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
