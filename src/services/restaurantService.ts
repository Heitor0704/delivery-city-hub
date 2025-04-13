
import { supabase } from "@/integrations/supabase/client";

export interface Restaurant {
  id: number;
  nome_estabelecimento: string;
  logomarca: string;
  descrição: string;
  telefone: string;
  email: string;
  cnpj: string;
  tipo_entrega: string;
  status: string;
  valor_entrega: number;
  tempo_min: number;
  tempo_max: number;
  avaliacoes?: number;
  destaque?: boolean;
  user_id: string;
  endereco?: any;
}

export interface Order {
  id: number;
  cliente_userId: string;
  valor_total: number;
  status: string;
  created_at: string;
  endereco_destino: string;
}

export interface OrderStats {
  today: number;
  revenue: number;
  conversion: number;
  newCustomers: number;
}

export interface SalesByMonth {
  name: string;
  total: number;
}

export interface OrdersByDay {
  name: string;
  pedidos: number;
}

export interface CategorySales {
  name: string;
  percentage: number;
}

export async function getRestaurantByUserId(userId: string): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from("Estabelecimento")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Erro ao buscar estabelecimento:", error);
    return null;
  }

  return data;
}

export async function getRecentOrders(restaurantId: number, limit: number = 5): Promise<Order[]> {
  const { data, error } = await supabase
    .from("Pedido")
    .select("*")
    .eq("estabelecimento_id", restaurantId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Erro ao buscar pedidos recentes:", error);
    return [];
  }

  return data || [];
}

export async function getOrderStats(restaurantId: number): Promise<OrderStats> {
  // Em uma aplicação real, esta seria uma chamada SQL mais complexa
  // Por agora, vamos simular com uma chamada básica e alguns cálculos

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Buscar pedidos de hoje
  const { data: todayOrders, error: todayError } = await supabase
    .from("Pedido")
    .select("id, valor_total")
    .eq("estabelecimento_id", restaurantId)
    .gte("created_at", today.toISOString());

  if (todayError) {
    console.error("Erro ao buscar estatísticas de pedidos:", todayError);
    return { today: 0, revenue: 0, conversion: 78, newCustomers: 0 };
  }

  // Calcular total de receita hoje
  const todayRevenue = todayOrders?.reduce((sum, order) => sum + (order.valor_total || 0), 0) || 0;
  
  // Buscar novos clientes (simplificado)
  const { count: newCustomers, error: customersError } = await supabase
    .from("Pedido")
    .select("cliente_userId", { count: "exact", head: true })
    .eq("estabelecimento_id", restaurantId)
    .gte("created_at", today.toISOString());

  if (customersError) {
    console.error("Erro ao buscar novos clientes:", customersError);
  }

  return {
    today: todayOrders?.length || 0,
    revenue: todayRevenue,
    conversion: 78, // Valor fixo por enquanto, poderia ser calculado
    newCustomers: newCustomers || 0
  };
}

export async function getSalesByMonth(restaurantId: number): Promise<SalesByMonth[]> {
  // Em uma implementação real, isto seria feito com SQL agrupado por mês
  // Por agora, vamos retornar dados simulados
  // No futuro, isto poderia ser uma stored procedure no Supabase
  
  return [
    { name: "Jan", total: 1800 },
    { name: "Fev", total: 2200 },
    { name: "Mar", total: 2500 },
    { name: "Abr", total: 2300 },
    { name: "Mai", total: 2800 },
    { name: "Jun", total: 3200 },
    { name: "Jul", total: 3500 },
  ];
}

export async function getOrdersByDay(restaurantId: number): Promise<OrdersByDay[]> {
  // Similiar ao anterior, seria uma consulta SQL agrupada por dia da semana
  // Por ora, retornamos dados simulados
  
  return [
    { name: "Dom", pedidos: 25 },
    { name: "Seg", pedidos: 18 },
    { name: "Ter", pedidos: 22 },
    { name: "Qua", pedidos: 30 },
    { name: "Qui", pedidos: 35 },
    { name: "Sex", pedidos: 48 },
    { name: "Sáb", pedidos: 52 },
  ];
}

export async function getCategorySales(restaurantId: number): Promise<CategorySales[]> {
  // Em uma implementação real, isto seria calculado a partir de itens de pedidos
  // Por ora, retornamos dados simulados
  
  return [
    { name: "Hambúrgueres", percentage: 45 },
    { name: "Pizzas", percentage: 30 },
    { name: "Bebidas", percentage: 15 },
    { name: "Sobremesas", percentage: 10 },
  ];
}
