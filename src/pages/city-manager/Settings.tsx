
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Save, User, MapPin, Building, Clock, CreditCard, MailOpen } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Schema de validação para dados do perfil
const profileFormSchema = z.object({
  nome: z.string().min(3, { message: "Nome precisa ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  telefone: z.string().min(8, { message: "Informe um telefone válido" }),
  cpf: z.string().min(11, { message: "CPF inválido" }),
});

// Schema de validação para dados da cidade
const cityFormSchema = z.object({
  nome: z.string().min(3, { message: "Nome da cidade precisa ter pelo menos 3 caracteres" }),
  estado: z.string().min(2, { message: "Estado inválido" }),
  cep: z.string().min(8, { message: "CEP inválido" }),
  populacao: z.coerce.number().min(1000, { message: "População precisa ser pelo menos 1000" }),
  area: z.coerce.number().min(1, { message: "Área precisa ser maior que 1" }),
  raioEntrega: z.coerce.number().min(1, { message: "Raio de entrega precisa ser pelo menos 1 km" }),
  taxaPadrao: z.coerce.number().min(0, { message: "Taxa não pode ser negativa" }),
});

// Schema de validação para notificações
const notificationsFormSchema = z.object({
  novoEstabelecimento: z.boolean().default(true),
  novoEntregador: z.boolean().default(true),
  pedidoProblema: z.boolean().default(true),
  comissaoPaga: z.boolean().default(true),
  notificacoesEmail: z.boolean().default(true),
  notificacoesSMS: z.boolean().default(false),
});

// Schema de validação para configurações de banco
const bankFormSchema = z.object({
  banco: z.string().min(1, { message: "Selecione um banco" }),
  agencia: z.string().min(1, { message: "Agência é obrigatória" }),
  conta: z.string().min(1, { message: "Conta é obrigatória" }),
  tipoConta: z.string().min(1, { message: "Selecione um tipo de conta" }),
  chavePix: z.string().min(3, { message: "Chave PIX é obrigatória" }),
  tipoChave: z.string().min(1, { message: "Selecione um tipo de chave" }),
});

// Dados mockados de horários
const mockWorkHours = {
  segunda: [{ inicio: "08:00", fim: "18:00" }],
  terca: [{ inicio: "08:00", fim: "18:00" }],
  quarta: [{ inicio: "08:00", fim: "18:00" }],
  quinta: [{ inicio: "08:00", fim: "18:00" }],
  sexta: [{ inicio: "08:00", fim: "18:00" }],
  sabado: [{ inicio: "09:00", fim: "15:00" }],
  domingo: []
};

export default function CityManagerSettings() {
  const [workHours, setWorkHours] = useState(mockWorkHours);
  
  // Formulários
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      nome: "João Silva",
      email: "joao.silva@exemplo.com",
      telefone: "(11) 98765-4321",
      cpf: "123.456.789-00",
    },
  });

  const cityForm = useForm<z.infer<typeof cityFormSchema>>({
    resolver: zodResolver(cityFormSchema),
    defaultValues: {
      nome: "São Paulo",
      estado: "SP",
      cep: "01000-000",
      populacao: 12000000,
      area: 1521,
      raioEntrega: 10,
      taxaPadrao: 5,
    },
  });

  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      novoEstabelecimento: true,
      novoEntregador: true,
      pedidoProblema: true,
      comissaoPaga: true,
      notificacoesEmail: true,
      notificacoesSMS: false,
    },
  });

  const bankForm = useForm<z.infer<typeof bankFormSchema>>({
    resolver: zodResolver(bankFormSchema),
    defaultValues: {
      banco: "001",
      agencia: "1234",
      conta: "12345-6",
      tipoConta: "corrente",
      chavePix: "joao.silva@exemplo.com",
      tipoChave: "email",
    },
  });

  // Funções para adicionar e remover horários
  const addTimeRange = (day: string) => {
    setWorkHours(prev => {
      const updatedHours = { ...prev };
      if (updatedHours[day as keyof typeof updatedHours]) {
        (updatedHours[day as keyof typeof updatedHours] as Array<any>).push({ inicio: "09:00", fim: "18:00" });
      }
      return updatedHours;
    });
  };

  const removeTimeRange = (day: string, index: number) => {
    setWorkHours(prev => {
      const updatedHours = { ...prev };
      if (updatedHours[day as keyof typeof updatedHours]) {
        (updatedHours[day as keyof typeof updatedHours] as Array<any>).splice(index, 1);
      }
      return updatedHours;
    });
  };

  const updateTimeRange = (day: string, index: number, field: 'inicio' | 'fim', value: string) => {
    setWorkHours(prev => {
      const updatedHours = { ...prev };
      if (updatedHours[day as keyof typeof updatedHours]) {
        const ranges = updatedHours[day as keyof typeof updatedHours] as Array<{ inicio: string, fim: string }>;
        if (ranges[index]) {
          ranges[index] = { ...ranges[index], [field]: value };
        }
      }
      return updatedHours;
    });
  };

  // Handlers para submissão dos formulários
  const onSubmitProfile = (data: z.infer<typeof profileFormSchema>) => {
    console.log("Dados do perfil:", data);
    toast({
      title: "Perfil atualizado",
      description: "Suas informações pessoais foram atualizadas com sucesso.",
    });
  };

  const onSubmitCity = (data: z.infer<typeof cityFormSchema>) => {
    console.log("Dados da cidade:", data);
    toast({
      title: "Informações da cidade atualizadas",
      description: "As configurações da cidade foram atualizadas com sucesso.",
    });
  };

  const onSubmitNotifications = (data: z.infer<typeof notificationsFormSchema>) => {
    console.log("Configurações de notificações:", data);
    toast({
      title: "Notificações atualizadas",
      description: "Suas preferências de notificação foram atualizadas com sucesso.",
    });
  };

  const onSubmitBank = (data: z.infer<typeof bankFormSchema>) => {
    console.log("Dados bancários:", data);
    toast({
      title: "Dados bancários atualizados",
      description: "Suas informações bancárias foram atualizadas com sucesso.",
    });
  };

  const onSubmitWorkHours = () => {
    console.log("Horários de funcionamento:", workHours);
    toast({
      title: "Horários atualizados",
      description: "Os horários de atendimento foram atualizados com sucesso.",
    });
  };

  return (
    <PageLayout 
      title="Configurações"
      description="Gerencie suas configurações pessoais e da plataforma."
    >
      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="city" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Cidade</span>
          </TabsTrigger>
          <TabsTrigger value="hours" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Horários</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <MailOpen className="h-4 w-4" />
            <span>Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="bank" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Informações Bancárias</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardContent className="p-6">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Dados Pessoais</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="cpf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CPF</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="telefone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Segurança</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <FormItem>
                          <FormLabel>Nova Senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Digite a nova senha" />
                          </FormControl>
                        </FormItem>
                      </div>
                      
                      <div>
                        <FormItem>
                          <FormLabel>Confirme a Senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirme a nova senha" />
                          </FormControl>
                          <FormDescription>
                            Deixe em branco para não alterar a senha.
                          </FormDescription>
                        </FormItem>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="city">
          <Card>
            <CardContent className="p-6">
              <Form {...cityForm}>
                <form onSubmit={cityForm.handleSubmit(onSubmitCity)} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Dados da Cidade</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={cityForm.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome da Cidade</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={cityForm.control}
                        name="estado"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o estado" />
                                </SelectTrigger>
                              </FormControl>
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={cityForm.control}
                        name="cep"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP (Central)</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={cityForm.control}
                        name="populacao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>População</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Configurações de Entrega</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={cityForm.control}
                        name="area"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Área (km²)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={cityForm.control}
                        name="raioEntrega"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Raio de Entrega (km)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Distância máxima padrão para entregas
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={cityForm.control}
                        name="taxaPadrao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Taxa de Entrega Padrão (R$)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hours">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Horários de Atendimento</h2>
                </div>
                
                <div className="space-y-4">
                  <Accordion type="multiple" defaultValue={["segunda", "terca", "quarta", "quinta", "sexta"]}>
                    {Object.entries(workHours).map(([day, ranges]) => {
                      const dayNames: Record<string, string> = {
                        segunda: "Segunda-feira",
                        terca: "Terça-feira",
                        quarta: "Quarta-feira",
                        quinta: "Quinta-feira",
                        sexta: "Sexta-feira",
                        sabado: "Sábado",
                        domingo: "Domingo"
                      };
                      
                      return (
                        <AccordionItem value={day} key={day}>
                          <AccordionTrigger className="hover:bg-muted/50 px-4">
                            <div className="flex items-center justify-between w-full">
                              <span>{dayNames[day]}</span>
                              <Badge variant="outline" className={ranges.length === 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                                {ranges.length === 0 ? "Fechado" : "Aberto"}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="p-4 pt-2">
                            {ranges.length === 0 ? (
                              <div className="flex items-center justify-between">
                                <p className="text-muted-foreground">Fechado neste dia</p>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => addTimeRange(day)}
                                >
                                  Adicionar Horário
                                </Button>
                              </div>
                            ) : (
                              <>
                                {ranges.map((range, index) => (
                                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
                                    <div>
                                      <FormLabel>Hora de Abertura</FormLabel>
                                      <Input
                                        type="time"
                                        value={range.inicio}
                                        onChange={(e) => updateTimeRange(day, index, 'inicio', e.target.value)}
                                      />
                                    </div>
                                    <div>
                                      <FormLabel>Hora de Fechamento</FormLabel>
                                      <Input
                                        type="time"
                                        value={range.fim}
                                        onChange={(e) => updateTimeRange(day, index, 'fim', e.target.value)}
                                      />
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button 
                                        type="button" 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={() => removeTimeRange(day, index)}
                                      >
                                        Remover
                                      </Button>
                                      {index === ranges.length - 1 && (
                                        <Button 
                                          type="button" 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => addTimeRange(day)}
                                        >
                                          Adicionar
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
                
                <div className="flex justify-end">
                  <Button type="button" onClick={onSubmitWorkHours}>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Horários
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardContent className="p-6">
              <Form {...notificationsForm}>
                <form onSubmit={notificationsForm.handleSubmit(onSubmitNotifications)} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Notificações do Sistema</h2>
                    <div className="space-y-4">
                      <FormField
                        control={notificationsForm.control}
                        name="novoEstabelecimento"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Novo Estabelecimento</FormLabel>
                              <FormDescription>
                                Receba notificações quando um novo estabelecimento se cadastrar na plataforma.
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
                        name="novoEntregador"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Novo Entregador</FormLabel>
                              <FormDescription>
                                Receba notificações quando um novo entregador se cadastrar na plataforma.
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
                        name="pedidoProblema"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Problemas com Pedidos</FormLabel>
                              <FormDescription>
                                Receba alertas quando houver problemas com pedidos que necessitam de intervenção.
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
                        name="comissaoPaga"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Pagamento de Comissões</FormLabel>
                              <FormDescription>
                                Receba alertas sobre pagamentos de comissões realizados ou pendentes.
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
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Canais de Notificação</h2>
                    <div className="space-y-4">
                      <FormField
                        control={notificationsForm.control}
                        name="notificacoesEmail"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Notificações por Email</FormLabel>
                              <FormDescription>
                                Receba notificações via email.
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
                        name="notificacoesSMS"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Notificações por SMS</FormLabel>
                              <FormDescription>
                                Receba notificações via SMS (cobranças adicionais podem ser aplicadas).
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
                  
                  <div className="flex justify-end">
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Preferências
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bank">
          <Card>
            <CardContent className="p-6">
              <Form {...bankForm}>
                <form onSubmit={bankForm.handleSubmit(onSubmitBank)} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Informações Bancárias</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={bankForm.control}
                        name="banco"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Banco</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um banco" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="001">Banco do Brasil</SelectItem>
                                <SelectItem value="104">Caixa Econômica Federal</SelectItem>
                                <SelectItem value="033">Santander</SelectItem>
                                <SelectItem value="341">Itaú</SelectItem>
                                <SelectItem value="237">Bradesco</SelectItem>
                                <SelectItem value="260">Nubank</SelectItem>
                                <SelectItem value="077">Inter</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={bankForm.control}
                        name="tipoConta"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Conta</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo de conta" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="corrente">Conta Corrente</SelectItem>
                                <SelectItem value="poupanca">Conta Poupança</SelectItem>
                                <SelectItem value="pagamento">Conta de Pagamento</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={bankForm.control}
                        name="agencia"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Agência</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={bankForm.control}
                        name="conta"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Conta (com dígito)</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Informações PIX</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={bankForm.control}
                        name="tipoChave"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Chave PIX</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo de chave" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="cpf">CPF</SelectItem>
                                <SelectItem value="cnpj">CNPJ</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="telefone">Telefone</SelectItem>
                                <SelectItem value="aleatoria">Chave Aleatória</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={bankForm.control}
                        name="chavePix"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chave PIX</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Informações Bancárias
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
