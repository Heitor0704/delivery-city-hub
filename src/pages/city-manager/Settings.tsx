
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
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CityManagerSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  
  // Delivery rates state
  const [baseRate, setBaseRate] = useState("5.00");
  const [kmRate, setKmRate] = useState("1.50");
  const [minimumDeliveryValue, setMinimumDeliveryValue] = useState("15.00");
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState("50.00");
  
  // Commission settings state
  const [appCommission, setAppCommission] = useState("10");
  const [deliveryCommission, setDeliveryCommission] = useState("5");
  const [isLoading, setIsLoading] = useState(false);
  
  // Notification settings state
  const [newStoresNotif, setNewStoresNotif] = useState(true);
  const [newDeliverersNotif, setNewDeliverersNotif] = useState(true);
  const [issuesNotif, setIssuesNotif] = useState(true);
  
  const handleDeliveryRatesSave = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Taxas atualizadas",
        description: "As taxas de entrega foram atualizadas com sucesso.",
      });
    }, 1000);
  };
  
  const handleCommissionSave = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Comissões atualizadas",
        description: "As configurações de comissões foram atualizadas com sucesso.",
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
      description="Gerencie as configurações da sua cidade."
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-3 lg:w-auto">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="delivery">Taxas de Entrega</TabsTrigger>
            <TabsTrigger value="commission">Comissões</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <ProfileSettings />
          </TabsContent>
          
          {/* Delivery Rates Tab */}
          <TabsContent value="delivery" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Taxas de Entrega</CardTitle>
                <CardDescription>
                  Configure as taxas de entrega padrão para a sua cidade.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="baseRate">Taxa Base (R$)</Label>
                  <Input 
                    id="baseRate" 
                    type="number"
                    placeholder="0.00" 
                    value={baseRate} 
                    onChange={(e) => setBaseRate(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Taxa mínima cobrada por entrega.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="kmRate">Taxa por Km (R$)</Label>
                  <Input 
                    id="kmRate" 
                    type="number"
                    placeholder="0.00" 
                    value={kmRate}
                    onChange={(e) => setKmRate(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Valor adicional cobrado por quilômetro.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="minimumValue">Valor Mínimo de Pedido (R$)</Label>
                  <Input 
                    id="minimumValue" 
                    type="number"
                    placeholder="0.00" 
                    value={minimumDeliveryValue}
                    onChange={(e) => setMinimumDeliveryValue(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Valor mínimo para aceitar pedidos.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="freeThreshold">Faixa para Entrega Grátis (R$)</Label>
                  <Input 
                    id="freeThreshold" 
                    type="number"
                    placeholder="0.00" 
                    value={freeDeliveryThreshold}
                    onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Valor a partir do qual a entrega será gratuita.
                  </p>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button onClick={handleDeliveryRatesSave} disabled={isLoading}>
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
          
          {/* Commission Tab */}
          <TabsContent value="commission" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Comissões</CardTitle>
                <CardDescription>
                  Configure as comissões para os estabelecimentos e entregadores.
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
                      value={appCommission}
                      onChange={(e) => setAppCommission(e.target.value)}
                      className="flex-1"
                    />
                    <span className="ml-2">%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Percentual que será retido dos estabelecimentos.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="deliveryCommission">Comissão dos Entregadores (%)</Label>
                  <div className="flex items-center">
                    <Input 
                      id="deliveryCommission" 
                      type="number"
                      placeholder="0" 
                      value={deliveryCommission}
                      onChange={(e) => setDeliveryCommission(e.target.value)}
                      className="flex-1"
                    />
                    <span className="ml-2">%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Percentual que será retido dos entregadores.
                  </p>
                </div>
                
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dynamicCommission">Comissão Dinâmica</Label>
                      <p className="text-sm text-muted-foreground">
                        Permitir comissões diferentes por estabelecimento.
                      </p>
                    </div>
                    <Switch id="dynamicCommission" />
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
        </Tabs>
      </div>
    </PageLayout>
  );
}
