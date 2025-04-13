
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, Filter, Eye, Edit, UserCheck, Store,
  MoreVertical, Check, X
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

const cities = [
  {
    id: 1,
    nome: "São Paulo",
    estado: "SP",
    totalEstabelecimentos: 125,
    totalEntregadores: 380,
    status: "ativo",
    gerente: "Ana Silva",
  },
  {
    id: 2,
    nome: "Rio de Janeiro",
    estado: "RJ",
    totalEstabelecimentos: 98,
    totalEntregadores: 250,
    status: "ativo",
    gerente: "João Santos",
  },
  {
    id: 3,
    nome: "Belo Horizonte",
    estado: "MG",
    totalEstabelecimentos: 65,
    totalEntregadores: 180,
    status: "ativo",
    gerente: "Carlos Mendes",
  },
  {
    id: 4,
    nome: "Curitiba",
    estado: "PR",
    totalEstabelecimentos: 42,
    totalEntregadores: 120,
    status: "inativo",
    gerente: "Paula Ferreira",
  },
  {
    id: 5,
    nome: "Salvador",
    estado: "BA",
    totalEstabelecimentos: 58,
    totalEntregadores: 150,
    status: "ativo",
    gerente: "Roberto Costa",
  },
];

// Lista de gerentes disponíveis
const availableManagers = [
  { id: 1, nome: "Ana Silva" },
  { id: 2, nome: "João Santos" },
  { id: 3, nome: "Carlos Mendes" },
  { id: 4, nome: "Paula Ferreira" },
  { id: 5, nome: "Roberto Costa" },
  { id: 6, nome: "Maria Oliveira" },
  { id: 7, nome: "Paulo Souza" },
  { id: 8, nome: "Fernanda Lima" },
];

const statusColors: Record<string, string> = {
  ativo: "bg-green-100 text-green-800 hover:bg-green-100",
  inativo: "bg-red-100 text-red-800 hover:bg-red-100",
  pendente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
};

interface CityFormData {
  id?: number;
  nome: string;
  estado: string;
  status: string;
  gerente: string;
}

export default function AdminCities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [stateFilter, setStateFilter] = useState("todos");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isManagerDialogOpen, setIsManagerDialogOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState<CityFormData | null>(null);
  const { toast } = useToast();

  const states = ["SP", "RJ", "MG", "PR", "BA"];

  const filteredCities = cities.filter((city) => {
    const matchesSearch = city.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         city.gerente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || city.status === statusFilter;
    const matchesState = stateFilter === "todos" || city.estado === stateFilter;
    
    return matchesSearch && matchesStatus && matchesState;
  });

  const handleAddCity = () => {
    setCurrentCity({ nome: "", estado: "SP", status: "ativo", gerente: "" });
    setIsAddDialogOpen(true);
  };

  const handleEditCity = (city: typeof cities[0]) => {
    setCurrentCity({
      id: city.id,
      nome: city.nome,
      estado: city.estado,
      status: city.status,
      gerente: city.gerente
    });
    setIsEditDialogOpen(true);
  };
  
  const handleAssignManager = (city: typeof cities[0]) => {
    setCurrentCity({
      id: city.id,
      nome: city.nome,
      estado: city.estado,
      status: city.status,
      gerente: city.gerente
    });
    setIsManagerDialogOpen(true);
  };

  const handleSaveCity = () => {
    if (!currentCity) return;
    
    toast({
      title: currentCity.id ? "Cidade atualizada!" : "Cidade adicionada!",
      description: `${currentCity.nome}, ${currentCity.estado} foi ${currentCity.id ? "atualizada" : "adicionada"} com sucesso.`,
    });
    
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  };

  const handleSaveManager = () => {
    if (!currentCity) return;
    
    toast({
      title: "Gerente atribuído!",
      description: `${currentCity.gerente} foi atribuído como gerente de ${currentCity.nome}.`,
    });
    
    setIsManagerDialogOpen(false);
  };

  const handleToggleStatus = (city: typeof cities[0]) => {
    const newStatus = city.status === "ativo" ? "inativo" : "ativo";
    
    toast({
      title: "Status atualizado!",
      description: `${city.nome} agora está ${newStatus}.`,
    });
  };

  return (
    <PageLayout 
      title="Gerenciar Cidades"
      description="Visualize e gerencie as cidades onde o FomeX está operando."
      actions={
        <Button size="sm" className="bg-fomex-orange hover:bg-fomex-orange/90" onClick={handleAddCity}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Cidade
        </Button>
      }
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cidades por nome ou gerente..."
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
                value={stateFilter}
                onValueChange={setStateFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os estados</SelectItem>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
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
                  <TableHead>Cidade</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Gerente</TableHead>
                  <TableHead>Estabelecimentos</TableHead>
                  <TableHead>Entregadores</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <TableRow key={city.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{city.nome}</TableCell>
                      <TableCell>{city.estado}</TableCell>
                      <TableCell>{city.gerente}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Store className="h-4 w-4 mr-1 text-fomex-orange" />
                          {city.totalEstabelecimentos}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <UserCheck className="h-4 w-4 mr-1 text-fomex-orange" />
                          {city.totalEntregadores}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[city.status]}>
                          {city.status.charAt(0).toUpperCase() + city.status.slice(1)}
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
                            <DropdownMenuItem onClick={() => handleEditCity(city)}>
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAssignManager(city)}>
                              <UserCheck className="mr-2 h-4 w-4" /> Atribuir Gerente
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(city)}>
                              {city.status === "ativo" ? (
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
                      Nenhuma cidade encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Dialog para adicionar cidade */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Cidade</DialogTitle>
            <DialogDescription>
              Insira os detalhes para adicionar uma nova cidade ao sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="city-name">Nome da Cidade</label>
              <Input
                id="city-name"
                value={currentCity?.nome || ""}
                onChange={(e) => setCurrentCity(prev => prev ? {...prev, nome: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="city-state">Estado</label>
              <Select
                value={currentCity?.estado || ""}
                onValueChange={(value) => setCurrentCity(prev => prev ? {...prev, estado: value} : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="city-manager">Gerente</label>
              <Select
                value={currentCity?.gerente || ""}
                onValueChange={(value) => setCurrentCity(prev => prev ? {...prev, gerente: value} : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um gerente" />
                </SelectTrigger>
                <SelectContent>
                  {availableManagers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.nome}>{manager.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="city-status">Status</label>
              <Select
                value={currentCity?.status || ""}
                onValueChange={(value) => setCurrentCity(prev => prev ? {...prev, status: value} : null)}
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
            <Button onClick={handleSaveCity} className="bg-fomex-orange hover:bg-fomex-orange/90">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar cidade */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Cidade</DialogTitle>
            <DialogDescription>
              Altere os detalhes da cidade {currentCity?.nome}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="city-name-edit">Nome da Cidade</label>
              <Input
                id="city-name-edit"
                value={currentCity?.nome || ""}
                onChange={(e) => setCurrentCity(prev => prev ? {...prev, nome: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="city-state-edit">Estado</label>
              <Select
                value={currentCity?.estado || ""}
                onValueChange={(value) => setCurrentCity(prev => prev ? {...prev, estado: value} : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="city-status-edit">Status</label>
              <Select
                value={currentCity?.status || ""}
                onValueChange={(value) => setCurrentCity(prev => prev ? {...prev, status: value} : null)}
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
            <Button onClick={handleSaveCity} className="bg-fomex-orange hover:bg-fomex-orange/90">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para atribuir gerente */}
      <Dialog open={isManagerDialogOpen} onOpenChange={setIsManagerDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Atribuir Gerente</DialogTitle>
            <DialogDescription>
              Selecione um gerente para a cidade {currentCity?.nome}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="city-manager-assign">Gerente</label>
              <Select
                value={currentCity?.gerente || ""}
                onValueChange={(value) => setCurrentCity(prev => prev ? {...prev, gerente: value} : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um gerente" />
                </SelectTrigger>
                <SelectContent>
                  {availableManagers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.nome}>{manager.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManagerDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveManager} className="bg-fomex-orange hover:bg-fomex-orange/90">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
