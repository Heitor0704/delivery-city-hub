import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { 
  Bell, 
  DollarSign, 
  Percent, 
  Save,
  Settings,
  Euro,
  CreditCard,
  Banknote 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("profile");
  
  const [defaultAppCommission, setDefaultAppCommission] = useState("10");
  const [defaultDeliveryCommission, setDefaultDeliveryCommission] = useState("5");
  const [defaultTaxRate, setDefaultTaxRate] = useState("2.5");
  
  const [mercadoPagoEnabled, setMercadoPagoEnabled] = useState(true);
  const [pixEnabled, setPixEnabled] = useState(true);
  const [cashEnabled, setCashEnabled] = useState(true);
  
  const [accessToken, setAccessToken] = useState("");
  const [publicKey, setPublicKey] = useState("");
  
  const [bankName, setBankName] = useState("");
  const [accountType, setAccountType] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [agency, setAgency] = useState("");
  const [pixKey, setPixKey] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  
  const [newCityNotif, setNewCityNotif] = useState(true);
  const [newManagerNotif, setNewManagerNotif] = useState(true);
  const [systemAlertNotif, setSystemAlertNotif] = useState(true);
  
  const handleCommissionSave = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Configurações salvas",
        description: "As configurações de comissão foram atualizadas com sucesso.",
      });
    }, 1000);
  };
  
  const handlePaymentSave = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Configurações salvas",
        description: "As configurações de pagamento foram atualizadas com sucesso.",
      });
    }, 1000);
  };
  
  const handleNotificationSettingsSave = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Configurações salvas",
        description: "Suas configurações de notificação foram atualizadas com sucesso.",
      });
    }, 1000);
  };

  return (
    <PageLayout 
      title="Configurações"
      description="Gerencie as configurações globais do sistema."
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-3 lg:w-auto">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="commission">Comissões</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="commission" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Comissões Padrão</CardTitle>
                <CardDescription>
                  Defina as taxas de comissão padrão para novas cidades.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="appCommission">Comissão do Aplicativo (%)</Label>
                  <div className="flex items-center">
                    <Input 
                      id="appCommission" 
                      type="number"
                      placeholder="0" 
                      value={defaultAppCommission}
                      onChange={(e) => setDefaultAppCommission(e.target.value)}
                      className="flex-1"
                    />
                    <span className="ml-2">%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Percentual padrão que será retido dos estabelecimentos.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="deliveryCommission">Comissão dos Entregadores (%)</Label>
                  <div className="flex items-center">
                    <Input 
                      id="deliveryCommission" 
                      type="number"
                      placeholder="0" 
                      value={defaultDeliveryCommission}
                      onChange={(e) => setDefaultDeliveryCommission(e.target.value)}
                      className="flex-1"
                    />
                    <span className="ml-2">%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Percentual padrão que será retido dos entregadores.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="taxRate">Taxa de Serviço (%)</Label>
                  <div className="flex items-center">
                    <Input 
                      id="taxRate" 
                      type="number"
                      placeholder="0" 
                      value={defaultTaxRate}
                      onChange={(e) => setDefaultTaxRate(e.target.value)}
                      className="flex-1"
                    />
                    <span className="ml-2">%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Taxa adicional cobrada ao cliente final.
                  </p>
                </div>
                
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="cityCommission">Comissões por Cidade</Label>
                      <p className="text-sm text-muted-foreground">
                        Permitir comissões personalizadas por cidade.
                      </p>
                    </div>
                    <Switch id="cityCommission" defaultChecked />
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button onClick={handleCommissionSave} disabled={isLoading}>
                    {isLoading ? (
                      <>Salvando...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Configurações
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Mercado Pago</CardTitle>
                <CardDescription>
                  Configure suas credenciais do Mercado Pago para processar pagamentos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="accessToken">Access Token</Label>
                  <Input 
                    id="accessToken" 
                    placeholder="Access Token do Mercado Pago" 
                    value={accessToken} 
                    onChange={(e) => setAccessToken(e.target.value)} 
                  />
                  <p className="text-sm text-muted-foreground">
                    Token de acesso para a API do Mercado Pago.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="publicKey">Chave Pública</Label>
                  <Input 
                    id="publicKey" 
                    placeholder="Chave Pública do Mercado Pago" 
                    value={publicKey} 
                    onChange={(e) => setPublicKey(e.target.value)} 
                  />
                  <p className="text-sm text-muted-foreground">
                    Chave pública para integração com o frontend.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Dados Bancários</CardTitle>
                <CardDescription>
                  Configure seus dados bancários para receber os pagamentos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="bankName">Banco</Label>
                    <Input 
                      id="bankName" 
                      placeholder="Nome do banco" 
                      value={bankName} 
                      onChange={(e) => setBankName(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="accountType">Tipo de Conta</Label>
                    <Input 
                      id="accountType" 
                      placeholder="Corrente ou Poupança" 
                      value={accountType} 
                      onChange={(e) => setAccountType(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="agency">Agência</Label>
                    <Input 
                      id="agency" 
                      placeholder="Número da agência" 
                      value={agency} 
                      onChange={(e) => setAgency(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="accountNumber">Conta</Label>
                    <Input 
                      id="accountNumber" 
                      placeholder="Número da conta" 
                      value={accountNumber} 
                      onChange={(e) => setAccountNumber(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-1 md:col-span-2">
                    <Label htmlFor="pixKey">Chave PIX</Label>
                    <Input 
                      id="pixKey" 
                      placeholder="CPF, e-mail, telefone ou chave aleatória" 
                      value={pixKey} 
                      onChange={(e) => setPixKey(e.target.value)} 
                    />
                    <p className="text-sm text-muted-foreground">
                      Sua chave PIX para recebimento de pagamentos imediatos.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="pt-4 flex justify-end">
              <Button onClick={handlePaymentSave} disabled={isLoading}>
                {isLoading ? (
                  <>Salvando...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Eventos de Notificação</CardTitle>
                <CardDescription>
                  Configure quais eventos você deseja receber notificações.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-5 w-5" />
                      <div>
                        <Label htmlFor="newCity">Nova cidade</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba notificações quando novas cidades forem cadastradas.
                        </p>
                      </div>
                    </div>
                    <Switch 
                      id="newCity" 
                      checked={newCityNotif} 
                      onCheckedChange={setNewCityNotif}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-5 w-5" />
                      <div>
                        <Label htmlFor="newManager">Novo gerente</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba notificações quando novos gerentes forem cadastrados.
                        </p>
                      </div>
                    </div>
                    <Switch 
                      id="newManager" 
                      checked={newManagerNotif} 
                      onCheckedChange={setNewManagerNotif}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-5 w-5" />
                      <div>
                        <Label htmlFor="systemAlert">Alertas do sistema</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba alertas importantes sobre o funcionamento do sistema.
                        </p>
                      </div>
                    </div>
                    <Switch 
                      id="systemAlert" 
                      checked={systemAlertNotif} 
                      onCheckedChange={setSystemAlertNotif}
                    />
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button onClick={handleNotificationSettingsSave} disabled={isLoading}>
                    {isLoading ? (
                      <>Salvando...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Configurações
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
