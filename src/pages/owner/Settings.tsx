import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, 
  Building2, 
  CreditCard, 
  Truck, 
  CheckCircle2,
  ImagePlus,
  MapPin,
  Plus
} from "lucide-react";

// Dados de exemplo do estabelecimento
const establishmentData = {
  nome: "Hambúrguer do Zé",
  razaoSocial: "José Restaurantes Ltda.",
  cnpj: "12.345.678/0001-90",
  telefone: "(11) 98765-4321",
  email: "contato@hamburguerdoze.com.br",
  endereco: "Avenida Paulista, 1000",
  bairro: "Bela Vista",
  cidade: "São Paulo",
  estado: "SP",
  cep: "01310-000",
  horarioFuncionamento: "De segunda a domingo, das 11h às 23h",
  logo: "/placeholder.svg",
  banner: "/placeholder.svg",
  mercadoPago: {
    ativo: false,
    publicKey: "",
    accessToken: "",
  },
  entrega: {
    tipo: "km",
    valorKm: "5,00",
    taxaMinima: "5,00",
    tempoEstimado: "30-45",
    regioes: [
      { nome: "Centro", taxa: "5,00", tempo: "30-45" },
      { nome: "Zona Norte", taxa: "7,00", tempo: "40-55" },
      { nome: "Zona Sul", taxa: "7,00", tempo: "40-55" },
    ],
    taxaFixa: "5,00"
  }
};

export default function OwnerSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState(establishmentData);
  const [entregaTipo, setEntregaTipo] = useState(establishmentData.entrega.tipo);
  const [logoPreview, setLogoPreview] = useState(establishmentData.logo);
  const [bannerPreview, setBannerPreview] = useState(establishmentData.banner);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleEntregaTipoChange = (tipo: string) => {
    setEntregaTipo(tipo);
    handleNestedInputChange('entrega', 'tipo', tipo);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBannerPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSaveSettings = () => {
    // Em um ambiente real, aqui faríamos uma chamada à API
    toast({
      title: "Configurações salvas",
      description: "As configurações foram salvas com sucesso.",
    });
  };

  return (
    <PageLayout 
      title="Configurações"
      description="Ajuste as configurações do seu estabelecimento."
    >
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="profile" className="flex-1 md:flex-none">
            <Building2 className="mr-2 h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex-1 md:flex-none">
            <CreditCard className="mr-2 h-4 w-4" />
            Pagamentos
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex-1 md:flex-none">
            <Truck className="mr-2 h-4 w-4" />
            Entregas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Estabelecimento</CardTitle>
              <CardDescription>
                Configure as informações básicas do seu estabelecimento que serão exibidas para os clientes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Estabelecimento</Label>
                  <Input 
                    id="nome" 
                    name="nome" 
                    value={formData.nome} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="razaoSocial">Razão Social</Label>
                  <Input 
                    id="razaoSocial" 
                    name="razaoSocial" 
                    value={formData.razaoSocial} 
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input 
                    id="cnpj" 
                    name="cnpj" 
                    value={formData.cnpj} 
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input 
                    id="telefone" 
                    name="telefone" 
                    value={formData.telefone} 
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input 
                  id="endereco" 
                  name="endereco" 
                  value={formData.endereco} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input 
                    id="bairro" 
                    name="bairro" 
                    value={formData.bairro} 
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input 
                    id="cidade" 
                    name="cidade" 
                    value={formData.cidade} 
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={formData.estado}
                    onValueChange={(value) => setFormData({...formData, estado: value})}
                  >
                    <SelectTrigger id="estado">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AC">Acre</SelectItem>
                      <SelectItem value="AL">Alagoas</SelectItem>
                      <SelectItem value="AP">Amapá</SelectItem>
                      <SelectItem value="AM">Amazonas</SelectItem>
                      <SelectItem value="BA">Bahia</SelectItem>
                      <SelectItem value="CE">Ceará</SelectItem>
                      <SelectItem value="DF">Distrito Federal</SelectItem>
                      <SelectItem value="ES">Espírito Santo</SelectItem>
                      <SelectItem value="GO">Goiás</SelectItem>
                      <SelectItem value="MA">Maranhão</SelectItem>
                      <SelectItem value="MT">Mato Grosso</SelectItem>
                      <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                      <SelectItem value="PA">Pará</SelectItem>
                      <SelectItem value="PB">Paraíba</SelectItem>
                      <SelectItem value="PR">Paraná</SelectItem>
                      <SelectItem value="PE">Pernambuco</SelectItem>
                      <SelectItem value="PI">Piauí</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                      <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                      <SelectItem value="RO">Rondônia</SelectItem>
                      <SelectItem value="RR">Roraima</SelectItem>
                      <SelectItem value="SC">Santa Catarina</SelectItem>
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="SE">Sergipe</SelectItem>
                      <SelectItem value="TO">Tocantins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input 
                    id="cep" 
                    name="cep" 
                    value={formData.cep} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="horarioFuncionamento">Horário de Funcionamento</Label>
                <Textarea 
                  id="horarioFuncionamento" 
                  name="horarioFuncionamento" 
                  value={formData.horarioFuncionamento} 
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Label>Logo do Estabelecimento</Label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-md overflow-hidden border">
                    <img 
                      src={logoPreview} 
                      alt="Logo" 
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <ImagePlus className="mr-2 h-4 w-4" />
                        Alterar Logo
                      </label>
                    </Button>
                    <input
                      type="file"
                      id="logo-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Banner do Estabelecimento</Label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-40 rounded-md overflow-hidden border">
                    <img 
                      src={bannerPreview} 
                      alt="Banner" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="banner-upload" className="cursor-pointer">
                        <ImagePlus className="mr-2 h-4 w-4" />
                        Alterar Banner
                      </label>
                    </Button>
                    <input
                      type="file"
                      id="banner-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleBannerChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integração com Mercado Pago</CardTitle>
              <CardDescription>
                Configure a integração com o Mercado Pago para aceitar pagamentos online.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="mp-ativo" 
                  checked={formData.mercadoPago.ativo} 
                  onCheckedChange={(checked) => handleNestedInputChange('mercadoPago', 'ativo', checked)} 
                />
                <Label htmlFor="mp-ativo">Ativar pagamentos online com Mercado Pago</Label>
              </div>
              
              {formData.mercadoPago.ativo && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="mp-publicKey">Public Key</Label>
                    <Input 
                      id="mp-publicKey" 
                      value={formData.mercadoPago.publicKey} 
                      onChange={(e) => handleNestedInputChange('mercadoPago', 'publicKey', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      A Public Key é utilizada para o checkout no frontend.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mp-accessToken">Access Token</Label>
                    <Input 
                      id="mp-accessToken" 
                      type="password"
                      value={formData.mercadoPago.accessToken} 
                      onChange={(e) => handleNestedInputChange('mercadoPago', 'accessToken', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      O Access Token é necessário para processamento de pagamentos.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-md border border-green-200">
                    <div className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium text-green-800">Como obter suas credenciais do Mercado Pago</h4>
                        <ol className="text-sm text-green-700 mt-1 space-y-1 list-decimal ml-4">
                          <li>Acesse sua conta do Mercado Pago</li>
                          <li>Vá para a seção de Desenvolvedores</li>
                          <li>Clique em "Credenciais"</li>
                          <li>Copie suas chaves para os campos acima</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="delivery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Entrega</CardTitle>
              <CardDescription>
                Defina como será calculado o valor da entrega para os clientes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Método de Cálculo da Taxa de Entrega</Label>
                <RadioGroup 
                  value={entregaTipo}
                  onValueChange={handleEntregaTipoChange}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="km" id="r1" />
                    <Label htmlFor="r1">Por Quilômetro (cálculo automático)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regioes" id="r2" />
                    <Label htmlFor="r2">Por Região (valores fixos por bairro)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixo" id="r3" />
                    <Label htmlFor="r3">Taxa Fixa (mesmo valor para todos)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {entregaTipo === "km" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valorKm">Valor por KM (R$)</Label>
                    <Input 
                      id="valorKm" 
                      value={formData.entrega.valorKm} 
                      onChange={(e) => handleNestedInputChange('entrega', 'valorKm', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="taxaMinima">Taxa Mínima (R$)</Label>
                    <Input 
                      id="taxaMinima" 
                      value={formData.entrega.taxaMinima} 
                      onChange={(e) => handleNestedInputChange('entrega', 'taxaMinima', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tempoEstimado">Tempo Estimado (min)</Label>
                    <Input 
                      id="tempoEstimado" 
                      value={formData.entrega.tempoEstimado} 
                      onChange={(e) => handleNestedInputChange('entrega', 'tempoEstimado', e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {entregaTipo === "regioes" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-3 gap-4 bg-muted/50 p-2 rounded-md">
                      <div><strong>Região/Bairro</strong></div>
                      <div><strong>Taxa de Entrega</strong></div>
                      <div><strong>Tempo Estimado</strong></div>
                    </div>
                    
                    {formData.entrega.regioes.map((regiao, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 border-b pb-2">
                        <Input 
                          value={regiao.nome} 
                          onChange={(e) => {
                            const newRegioes = [...formData.entrega.regioes];
                            newRegioes[index].nome = e.target.value;
                            handleNestedInputChange('entrega', 'regioes', newRegioes);
                          }}
                        />
                        <div className="flex items-center">
                          <span className="mr-2">R$</span>
                          <Input 
                            value={regiao.taxa} 
                            onChange={(e) => {
                              const newRegioes = [...formData.entrega.regioes];
                              newRegioes[index].taxa = e.target.value;
                              handleNestedInputChange('entrega', 'regioes', newRegioes);
                            }}
                          />
                        </div>
                        <div className="flex items-center">
                          <Input 
                            value={regiao.tempo} 
                            onChange={(e) => {
                              const newRegioes = [...formData.entrega.regioes];
                              newRegioes[index].tempo = e.target.value;
                              handleNestedInputChange('entrega', 'regioes', newRegioes);
                            }}
                          />
                          <span className="ml-2">min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="flex items-center">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Região
                  </Button>
                </div>
              )}
              
              {entregaTipo === "fixo" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxaFixa">Taxa Fixa de Entrega (R$)</Label>
                    <Input 
                      id="taxaFixa" 
                      value={formData.entrega.taxaFixa} 
                      onChange={(e) => handleNestedInputChange('entrega', 'taxaFixa', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tempoEstimadoFixo">Tempo Estimado (min)</Label>
                    <Input 
                      id="tempoEstimadoFixo" 
                      value={formData.entrega.tempoEstimado} 
                      onChange={(e) => handleNestedInputChange('entrega', 'tempoEstimado', e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                <div className="flex gap-2">
                  <MapPin className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-800">Dica sobre entregas</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      O método por quilômetro é mais preciso e justo, calculando a distância real entre o estabelecimento e o cliente.
                      Recomendamos utilizar esse método para melhorar a satisfação dos clientes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button 
          className="bg-fomex-orange hover:bg-fomex-orange/90"
          onClick={handleSaveSettings}
        >
          <Save className="mr-2 h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>
    </PageLayout>
  );
}
