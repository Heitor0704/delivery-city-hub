
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
  AlertCircle, 
  Check, 
  Bell, 
  CreditCard, 
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OwnerSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  
  // Payment settings state
  const [accessToken, setAccessToken] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Notification settings state
  const [orderReceivedNotif, setOrderReceivedNotif] = useState(true);
  const [orderCanceledNotif, setOrderCanceledNotif] = useState(true);
  const [reviewNotif, setReviewNotif] = useState(true);
  const [promotionNotif, setPromotionNotif] = useState(false);
  
  const handlePaymentSettingsSave = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Configurações salvas",
        description: "Suas configurações de pagamento foram atualizadas com sucesso.",
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
      description="Gerencie as configurações do seu estabelecimento."
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-3 lg:w-auto">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <ProfileSettings />
          </TabsContent>
          
          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Pagamento</CardTitle>
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
                    Você pode obter seu Access Token no painel do Mercado Pago.
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
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button onClick={handlePaymentSettingsSave} disabled={isLoading}>
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
            
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pagamento Aceitos</CardTitle>
                <CardDescription>
                  Selecione quais métodos de pagamento você deseja aceitar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5" />
                      <Label htmlFor="creditCard">Cartão de Crédito</Label>
                    </div>
                    <Switch id="creditCard" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5" />
                      <Label htmlFor="debitCard">Cartão de Débito</Label>
                    </div>
                    <Switch id="debitCard" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5" />
                      <Label htmlFor="pix">Pix</Label>
                    </div>
                    <Switch id="pix" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5" />
                      <Label htmlFor="cash">Dinheiro (na entrega)</Label>
                    </div>
                    <Switch id="cash" defaultChecked />
                  </div>
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
                        <Label htmlFor="orderReceived">Pedido recebido</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba notificações quando novos pedidos chegarem.
                        </p>
                      </div>
                    </div>
                    <Switch 
                      id="orderReceived" 
                      checked={orderReceivedNotif} 
                      onCheckedChange={setOrderReceivedNotif}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-5 w-5" />
                      <div>
                        <Label htmlFor="orderCanceled">Pedido cancelado</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba notificações quando pedidos forem cancelados.
                        </p>
                      </div>
                    </div>
                    <Switch 
                      id="orderCanceled" 
                      checked={orderCanceledNotif} 
                      onCheckedChange={setOrderCanceledNotif}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-5 w-5" />
                      <div>
                        <Label htmlFor="review">Avaliações</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba notificações quando clientes deixarem avaliações.
                        </p>
                      </div>
                    </div>
                    <Switch 
                      id="review" 
                      checked={reviewNotif} 
                      onCheckedChange={setReviewNotif}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-5 w-5" />
                      <div>
                        <Label htmlFor="promotion">Promoções</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba notificações sobre promoções e campanhas.
                        </p>
                      </div>
                    </div>
                    <Switch 
                      id="promotion" 
                      checked={promotionNotif} 
                      onCheckedChange={setPromotionNotif}
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
