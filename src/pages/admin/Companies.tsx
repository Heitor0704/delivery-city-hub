
import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, Filter, Edit, X, Check,
  MapPin, Phone, Store, MoreVertical, Loader2
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
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Establishment {
  id: number;
  nome: string;
  categoria: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  status: string;
}

interface DbEstablishment {
  id: number;
  nome_estabelecimento: string;
  telefone: string;
  status: string;
  cidade_id: number;
  descrição?: string;
  logomarca?: string;
  email?: string;
  cnpj?: string;
}

interface City {
  id: number;
  cidade: string;
  estado: string;
}

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
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusColors: Record<string, string> = {
    ativo: "bg-green-100 text-green-800 hover:bg-green-100",
    inativo: "bg-red-100 text-red-800 hover:bg-red-100",
    pendente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  };

  // Fetch establishments from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch establishments
        const { data: establishmentsData, error: establishmentsError } = await supabase
          .from("Estabelecimento")
          .select("*");
        
        if (establishmentsError) throw establishmentsError;
        
        // Fetch cities for mapping city_id to names
        const { data: citiesData, error: citiesError } = await supabase
          .from("Cidade")
          .select("*");
        
        if (citiesError) throw citiesError;
        
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("Categoria")
          .select("*");
        
        if (categoriesError) throw categoriesError;
        
        // Process cities data
        const citiesMap = new Map<number, City>();
        if (citiesData) {
          citiesData.forEach((city) => {
            citiesMap.set(city.id, {
              id: city.id,
              cidade: city.cidade,
              estado: city.estado
            });
          });
          setCities(citiesData.map(city => ({
            id: city.id,
            cidade: city.cidade,
            estado: city.estado
          })));
        }
        
        // Process categories data
        if (categoriesData) {
          const uniqueCategories = Array.from(new Set(categoriesData.map(cat => cat.categoria)))
            .filter(Boolean) as string[];
          setCategories(uniqueCategories);
        }
        
        // Process establishments data
        if (establishmentsData) {
          const processedEstablishments = establishmentsData.map((est) => {
            const city = citiesMap.get(est.cidade_id || 0);
            
            // Assign a random category for now since there's no direct relation in our data
            const randomCategory = categoriesData && categoriesData.length > 0
              ? categoriesData[Math.floor(Math.random() * categoriesData.length)].categoria
              : "Geral";
            
            return {
              id: est.id,
              nome: est.nome_estabelecimento || "Sem nome",
              categoria: randomCategory,
              telefone: est.telefone || "Não informado",
              endereco: est.endereco ? JSON.stringify(est.endereco) : "Não informado",
              cidade: city?.cidade || "Não informada",
              estado: city?.estado || "N/A",
              status: est.status || "inativo"
            };
          });
          
          setEstablishments(processedEstablishments);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Erro ao buscar dados");
        toast.error("Erro ao buscar dados dos estabelecimentos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter establishments based on search and filters
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

  const handleEditEstablishment = (est: Establishment) => {
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

  const handleSaveEstablishment = async () => {
    if (!currentEstablishment) return;
    
    try {
      setLoading(true);
      
      // Find city id from name
      const city = cities.find(c => c.cidade === currentEstablishment.cidade);
      const city_id = city ? city.id : null;
      
      if (currentEstablishment.id) {
        // Update existing establishment
        const { error } = await supabase
          .from("Estabelecimento")
          .update({ 
            nome_estabelecimento: currentEstablishment.nome,
            telefone: currentEstablishment.telefone,
            cidade_id: city_id,
            status: currentEstablishment.status
          })
          .eq("id", currentEstablishment.id);
          
        if (error) throw error;
        
        // Update local state
        setEstablishments(establishments.map(est => 
          est.id === currentEstablishment.id 
            ? {
                ...est,
                nome: currentEstablishment.nome,
                categoria: currentEstablishment.categoria,
                telefone: currentEstablishment.telefone,
                status: currentEstablishment.status,
                cidade: currentEstablishment.cidade,
                estado: currentEstablishment.estado
              } 
            : est
        ));
        
        toast.success("Estabelecimento atualizado com sucesso!");
      } else {
        // Add new establishment
        const newEstId = establishments.length > 0 ? Math.max(...establishments.map(e => e.id)) + 1 : 1;
        
        const { error } = await supabase
          .from("Estabelecimento")
          .insert({ 
            id: newEstId,
            nome_estabelecimento: currentEstablishment.nome,
            telefone: currentEstablishment.telefone,
            cidade_id: city_id,
            status: currentEstablishment.status
          });
          
        if (error) throw error;
        
        // Add to local state
        setEstablishments([...establishments, {
          id: newEstId,
          nome: currentEstablishment.nome,
          categoria: currentEstablishment.categoria,
          telefone: currentEstablishment.telefone,
          endereco: currentEstablishment.endereco,
          cidade: currentEstablishment.cidade,
          estado: currentEstablishment.estado,
          status: currentEstablishment.status
        }]);
        
        toast.success("Estabelecimento adicionado com sucesso!");
      }
    } catch (err) {
      console.error("Error saving establishment:", err);
      toast.error("Erro ao salvar estabelecimento: " + (err instanceof Error ? err.message : "Erro desconhecido"));
    } finally {
      setLoading(false);
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
    }
  };

  const handleToggleStatus = async (est: Establishment) => {
    const newStatus = est.status === "ativo" ? "inativo" : "ativo";
    
    try {
      const { error } = await supabase
        .from("Estabelecimento")
        .update({ status: newStatus })
        .eq("id", est.id);
        
      if (error) throw error;
      
      // Update local state
      setEstablishments(establishments.map(e => 
        e.id === est.id 
          ? {...e, status: newStatus} 
          : e
      ));
      
      toast.success(`${est.nome} agora está ${newStatus}.`);
    } catch (err) {
      console.error("Error toggling status:", err);
      toast.error("Erro ao alterar status: " + (err instanceof Error ? err.message : "Erro desconhecido"));
    }
  };

  // Function to handle city selection
  const handleCityChange = (cityId: string) => {
    const selectedCity = cities.find(c => c.id === parseInt(cityId));
    if (selectedCity && currentEstablishment) {
      setCurrentEstablishment({
        ...currentEstablishment,
        cidade: selectedCity.cidade,
        estado: selectedCity.estado
      });
    }
  };

  if (loading && establishments.length === 0) {
    return (
      <PageLayout
        title="Gerenciar Estabelecimentos"
        description="Visualize e gerencie os estabelecimentos da plataforma FomeX."
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-fomex-orange" />
          <span className="ml-2">Carregando estabelecimentos...</span>
        </div>
      </PageLayout>
    );
  }

  if (error && establishments.length === 0) {
    return (
      <PageLayout
        title="Gerenciar Estabelecimentos"
        description="Visualize e gerencie os estabelecimentos da plataforma FomeX."
      >
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 mb-4">Erro ao carregar estabelecimentos: {error}</p>
          <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
        </div>
      </PageLayout>
    );
  }

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
                  String(cities.find(c => c.cidade === currentEstablishment.cidade)?.id || "") : 
                  ""}
                onValueChange={handleCityChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma cidade" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={String(city.id)}>
                      {city.cidade}/{city.estado}
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
                  String(cities.find(c => c.cidade === currentEstablishment.cidade)?.id || "") : 
                  ""}
                onValueChange={handleCityChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma cidade" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={String(city.id)}>
                      {city.cidade}/{city.estado}
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
