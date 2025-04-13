
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
  Euro
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  
  // App commission settings
  const [defaultAppCommission, setDefaultAppCommission] = useState("10");
  const [defaultDeliveryCommission, setDefaultDeliveryCommission] = useState("5");
  const [defaultTaxRate, setDefaultTaxRate] = useState("2.5");
  
  // Payment settings
  const [mercadoPagoEnabled, setMercadoPagoEnabled] = useState(true);
  const [pixEnabled, setPixEnabled] = useState(true);
  const [cashEnabled, setCashEnabled] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Notification settings state
  const [newCityNotif, setNewCityNotif] = useState(true);
  const [newManagerNotif, setNewManagerNotif] = useState(true);
  const [systemAlertNotif, setSystemAlertNotif] = useState(true);
  
  const handleCommissionSave = () => {
    setIsLoading(true);
    
    // Simulate API call
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
    
    // Simulate API call
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
    
    // Simulate API call
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
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-4 lg:w-auto">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="commission">Comissões</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <ProfileSettings />
          </TabsContent>
          
          {/* Commission Tab */}
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
          
          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Pagamento</CardTitle>
                <CardDescription>
                  Ative ou desative os métodos de pagamento disponíveis no sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Euro className="h-5 w-5" />
                      <div>
                        <Label htmlFor="mercadoPago">Mercado Pago</Label>
                        <p className="text-sm text-muted-foreground">
                          Habilitar pagamentos via Mercado Pago.
                        </p>
                      </div>
                    </div>
                    <Switch 
                      id="mercadoPago" 
                      checked={mercadoPagoEnabled} 
                      onCheckedChange={setMercadoPagoEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <div>
                        <Label htmlFor="pix">PIX</Label>
                        <p className="text-sm text-muted-foreground">
                          Habilitar pagamentos via PIX.
                        </p>
                      </div>
                    </div>
                    <Switch 
                      id="pix" 
                      checked={pixEnabled} 
                      onCheckedChange={setPixEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <div>
                        <Label htmlFor="cash">Dinheiro</Label>
                        <p className="text-sm text-muted-foreground">
                          Habilitar pagamentos em dinheiro.
                        </p>
                      </div>
                    </div>
                    <Switch 
                      id="cash" 
                      checked={cashEnabled} 
                      onCheckedChange={setCashEnabled}
                    />
                  </div>
                </div>
                
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
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Tab */}
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
