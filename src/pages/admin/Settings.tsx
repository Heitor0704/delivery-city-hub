
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Save,
  CreditCard,
  Percent,
  WalletCards,
  Truck,
  Bell,
  Mail,
  MessageSquare
} from "lucide-react";

// Schema para validação do formulário de comissões
const commissionsFormSchema = z.object({
  defaultCommissionRate: z.string().min(1, {
    message: "Taxa de comissão é obrigatória.",
  }),
  minCommissionValue: z.string().min(1, {
    message: "Valor mínimo de comissão é obrigatório.",
  }),
  hasDeliveryFee: z.boolean(),
  deliveryFeeRate: z.string().min(1, {
    message: "Taxa de entrega é obrigatória.",
  }),
  minDeliveryFeeValue: z.string().min(1, {
    message: "Valor mínimo de entrega é obrigatório.",
  }),
  hasServiceFee: z.boolean(),
  serviceFeeRate: z.string().min(1, {
    message: "Taxa de serviço é obrigatória.",
  }),
  minServiceFeeValue: z.string().min(1, {
    message: "Valor mínimo de serviço é obrigatório.",
  }),
});

// Schema para validação do formulário de pagamentos
const paymentsFormSchema = z.object({
  acceptCreditCard: z.boolean(),
  acceptDebitCard: z.boolean(),
  acceptPix: z.boolean(),
  acceptMoney: z.boolean(),
  allowMultiplePaymentMethods: z.boolean(),
  paymentProvider: z.enum(["stripe", "pagseguro", "mercadopago", "cielo"]),
  merchantId: z.string().min(1, {
    message: "ID do lojista é obrigatório.",
  }),
  apiKey: z.string().min(1, {
    message: "Chave API é obrigatória.",
  }),
  secretKey: z.string().min(1, {
    message: "Chave secreta é obrigatória.",
  }),
});

// Schema para validação do formulário de notificações
const notificationsFormSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  notifyAdminNewStore: z.boolean(),
  notifyAdminNewOrder: z.boolean(),
  notifyDeliveryDelays: z.boolean(),
  emailTemplate: z.string().min(10, {
    message: "Modelo de e-mail deve ter pelo menos 10 caracteres.",
  }),
});

type CommissionsFormValues = z.infer<typeof commissionsFormSchema>;
type PaymentsFormValues = z.infer<typeof paymentsFormSchema>;
type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("commissions");
  const { toast } = useToast();

  // Formulário de comissões
  const commissionsForm = useForm<CommissionsFormValues>({
    resolver: zodResolver(commissionsFormSchema),
    defaultValues: {
      defaultCommissionRate: "10",
      minCommissionValue: "2.50",
      hasDeliveryFee: true,
      deliveryFeeRate: "5",
      minDeliveryFeeValue: "5.00",
      hasServiceFee: true,
      serviceFeeRate: "2",
      minServiceFeeValue: "1.00",
    },
  });

  // Formulário de pagamentos
  const paymentsForm = useForm<PaymentsFormValues>({
    resolver: zodResolver(paymentsFormSchema),
    defaultValues: {
      acceptCreditCard: true,
      acceptDebitCard: true,
      acceptPix: true,
      acceptMoney: true,
      allowMultiplePaymentMethods: true,
      paymentProvider: "stripe",
      merchantId: "merchant_123456",
      apiKey: "pk_test_123456",
      secretKey: "sk_test_123456",
    },
  });

  // Formulário de notificações
  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      notifyAdminNewStore: true,
      notifyAdminNewOrder: false,
      notifyDeliveryDelays: true,
      emailTemplate: `Olá {name},

Obrigado por usar o FomeX!

{message}

Atenciosamente,
Equipe FomeX`,
    },
  });

  // Função para salvar formulário de comissões
  const onCommissionsSave = (data: CommissionsFormValues) => {
    console.log(data);
    toast({
      title: "Configurações de comissões salvas",
      description: "As configurações de comissões foram atualizadas com sucesso.",
    });
  };

  // Função para salvar formulário de pagamentos
  const onPaymentsSave = (data: PaymentsFormValues) => {
    console.log(data);
    toast({
      title: "Configurações de pagamento salvas",
      description: "As configurações de pagamento foram atualizadas com sucesso.",
    });
  };

  // Função para salvar formulário de notificações
  const onNotificationsSave = (data: NotificationsFormValues) => {
    console.log(data);
    toast({
      title: "Configurações de notificações salvas",
      description: "As configurações de notificações foram atualizadas com sucesso.",
    });
  };

  return (
    <PageLayout 
      title="Configurações"
      description="Ajuste as configurações globais da plataforma FomeX."
    >
      <Tabs defaultValue="commissions" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="commissions" className="flex-1 sm:flex-none"><Percent className="mr-2 h-4 w-4" />Comissões e Taxas</TabsTrigger>
          <TabsTrigger value="payments" className="flex-1 sm:flex-none"><CreditCard className="mr-2 h-4 w-4" />Pagamentos</TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1 sm:flex-none"><Bell className="mr-2 h-4 w-4" />Notificações</TabsTrigger>
        </TabsList>
        
        {/* Comissões e Taxas */}
        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="mr-2 h-5 w-5" />
                Configurações de Comissões
              </CardTitle>
              <CardDescription>
                Define as taxas de comissão padrão para os estabelecimentos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...commissionsForm}>
                <form onSubmit={commissionsForm.handleSubmit(onCommissionsSave)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={commissionsForm.control}
                      name="defaultCommissionRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Taxa de Comissão Padrão (%)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input {...field} type="number" step="0.1" min="0" />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <span className="text-sm text-gray-500">%</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Porcentagem cobrada sobre o valor total do pedido.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={commissionsForm.control}
                      name="minCommissionValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Mínimo de Comissão (R$)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input {...field} type="number" step="0.01" min="0" />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <span className="text-sm text-gray-500">R$</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Valor mínimo cobrado por pedido, independente do percentual.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <FormField
                      control={commissionsForm.control}
                      name="hasDeliveryFee"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Taxa de Entrega</FormLabel>
                            <FormDescription>
                              Ativar cobrança de taxa de entrega.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {commissionsForm.watch("hasDeliveryFee") && (
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 ml-4 border-l-2 pl-4 border-muted">
                        <FormField
                          control={commissionsForm.control}
                          name="deliveryFeeRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Taxa de Entrega Padrão (%)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input {...field} type="number" step="0.1" min="0" />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-sm text-gray-500">%</span>
                                  </div>
                                </div>
                              </FormControl>
                              <FormDescription>
                                Porcentagem sobre o valor do pedido.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={commissionsForm.control}
                          name="minDeliveryFeeValue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor Mínimo de Taxa de Entrega (R$)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input {...field} type="number" step="0.01" min="0" />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-sm text-gray-500">R$</span>
                                  </div>
                                </div>
                              </FormControl>
                              <FormDescription>
                                Valor mínimo cobrado por entrega.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <FormField
                      control={commissionsForm.control}
                      name="hasServiceFee"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Taxa de Serviço</FormLabel>
                            <FormDescription>
                              Ativar cobrança de taxa de serviço.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {commissionsForm.watch("hasServiceFee") && (
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 ml-4 border-l-2 pl-4 border-muted">
                        <FormField
                          control={commissionsForm.control}
                          name="serviceFeeRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Taxa de Serviço Padrão (%)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input {...field} type="number" step="0.1" min="0" />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-sm text-gray-500">%</span>
                                  </div>
                                </div>
                              </FormControl>
                              <FormDescription>
                                Porcentagem sobre o valor do pedido.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={commissionsForm.control}
                          name="minServiceFeeValue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor Mínimo de Taxa de Serviço (R$)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input {...field} type="number" step="0.01" min="0" />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-sm text-gray-500">R$</span>
                                  </div>
                                </div>
                              </FormControl>
                              <FormDescription>
                                Valor mínimo cobrado por pedido.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="bg-fomex-orange hover:bg-fomex-orange/90">
                    <Save className="mr-2 h-4 w-4" /> Salvar Configurações
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Pagamentos */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Configurações de Pagamento
              </CardTitle>
              <CardDescription>
                Define os métodos de pagamento aceitos e as integrações com gateways.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...paymentsForm}>
                <form onSubmit={paymentsForm.handleSubmit(onPaymentsSave)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Métodos de Pagamento</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={paymentsForm.control}
                        name="acceptCreditCard"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Cartão de Crédito</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={paymentsForm.control}
                        name="acceptDebitCard"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Cartão de Débito</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={paymentsForm.control}
                        name="acceptPix"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Pix</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={paymentsForm.control}
                        name="acceptMoney"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Dinheiro</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={paymentsForm.control}
                      name="allowMultiplePaymentMethods"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Permitir Pagamento com Múltiplos Métodos</FormLabel>
                            <FormDescription>
                              Permite que um pedido seja pago usando mais de um método de pagamento.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Gateway de Pagamento</h3>
                    <FormField
                      control={paymentsForm.control}
                      name="paymentProvider"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Provedor de Pagamento</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="stripe" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Stripe
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="pagseguro" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  PagSeguro
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="mercadopago" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Mercado Pago
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="cielo" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Cielo
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={paymentsForm.control}
                        name="merchantId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID do Lojista</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={paymentsForm.control}
                        name="apiKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chave API</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={paymentsForm.control}
                        name="secretKey"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Chave Secreta</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="bg-fomex-orange hover:bg-fomex-orange/90">
                    <Save className="mr-2 h-4 w-4" /> Salvar Configurações
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notificações */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Configurações de Notificações
              </CardTitle>
              <CardDescription>
                Define como e quando as notificações são enviadas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationsForm}>
                <form onSubmit={notificationsForm.handleSubmit(onNotificationsSave)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Canais de Notificação</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={notificationsForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base flex items-center">
                                <Mail className="mr-2 h-4 w-4" />
                                Email
                              </FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationsForm.control}
                        name="pushNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base flex items-center">
                                <Bell className="mr-2 h-4 w-4" />
                                Push
                              </FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationsForm.control}
                        name="smsNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base flex items-center">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                SMS
                              </FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Eventos para Notificação</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                      <FormField
                        control={notificationsForm.control}
                        name="notifyAdminNewStore"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Notificar Administrador sobre Novos Estabelecimentos</FormLabel>
                              <FormDescription>
                                Envia notificação quando um novo estabelecimento se cadastra.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationsForm.control}
                        name="notifyAdminNewOrder"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Notificar Administrador sobre Novos Pedidos</FormLabel>
                              <FormDescription>
                                Envia notificação para o administrador quando um novo pedido é feito.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationsForm.control}
                        name="notifyDeliveryDelays"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Notificar Atrasos na Entrega</FormLabel>
                              <FormDescription>
                                Envia notificação quando uma entrega está atrasada.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Modelo de Email</h3>
                    <FormField
                      control={notificationsForm.control}
                      name="emailTemplate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Template de Email</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={8}
                              placeholder="Digite o modelo de email aqui..."
                            />
                          </FormControl>
                          <FormDescription>
                            Use {"{name}"} para o nome do destinatário e {"{message}"} para o conteúdo da mensagem.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="bg-fomex-orange hover:bg-fomex-orange/90">
                    <Save className="mr-2 h-4 w-4" /> Salvar Configurações
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
