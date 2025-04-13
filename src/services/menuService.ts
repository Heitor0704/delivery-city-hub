
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: number;
  categoria: string;
  ativo: boolean;
  estabelecimento_id: number;
  created_at: string;
}

export interface Addon {
  id: number;
  nome: string;
  preco: number;
  ativo: boolean;
}

export interface MenuLevel {
  id: number;
  nome: string;
  qtd_opcoes_min: number;
  qtd_opcoes_max: number;
  ativo: boolean;
  obrigatorio: boolean;
  estabelecimento_id: number; // Added this required field
}

export interface MenuOption {
  id: number;
  nome: string;
  valor: number;
  nivel_id: number;
  ativo: boolean;
}

export async function getCategories(restaurantId: number): Promise<Category[]> {
  const { data, error } = await supabase
    .from("Categoria")
    .select("*")
    .eq("estabelecimento_id", restaurantId)
    .order("categoria");

  if (error) {
    console.error("Erro ao buscar categorias:", error);
    return [];
  }

  return data || [];
}

export async function createCategory(category: Partial<Category>): Promise<Category | null> {
  const { data, error } = await supabase
    .from("Categoria")
    .insert([category])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar categoria:", error);
    return null;
  }

  return data;
}

export async function updateCategory(id: number, category: Partial<Category>): Promise<Category | null> {
  const { data, error } = await supabase
    .from("Categoria")
    .update(category)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar categoria:", error);
    return null;
  }

  return data;
}

export async function deleteCategory(id: number): Promise<boolean> {
  const { error } = await supabase
    .from("Categoria")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao excluir categoria:", error);
    return false;
  }

  return true;
}

// Implementar métodos para os níveis de menu
export async function getMenuLevels(restaurantId: number): Promise<MenuLevel[]> {
  const { data, error } = await supabase
    .from("Nivel Cardapio")
    .select("*")
    .eq("estabelecimento_id", restaurantId)
    .order("ordem");

  if (error) {
    console.error("Erro ao buscar níveis do cardápio:", error);
    return [];
  }

  return data || [];
}

export async function createMenuLevel(level: { 
  nome: string; 
  qtd_opcoes_min?: number; 
  qtd_opcoes_max?: number; 
  ativo?: boolean; 
  obrigatorio?: boolean;
  estabelecimento_id: number;
}): Promise<MenuLevel | null> {
  const { data, error } = await supabase
    .from("Nivel Cardapio")
    .insert([level])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar nível do cardápio:", error);
    return null;
  }

  return data;
}

// Implementar métodos para opções de menu
export async function getMenuOptions(levelId: number): Promise<MenuOption[]> {
  const { data, error } = await supabase
    .from("Opcao Cardapio")
    .select("*")
    .eq("nivel_id", levelId)
    .order("ordem");

  if (error) {
    console.error("Erro ao buscar opções de cardápio:", error);
    return [];
  }

  return data || [];
}

export async function createMenuOption(option: { 
  nome: string; 
  valor?: number;
  nivel_id: number;
  ativo?: boolean;
}): Promise<MenuOption | null> {
  const { data, error } = await supabase
    .from("Opcao Cardapio")
    .insert([option])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar opção de cardápio:", error);
    return null;
  }

  return data;
}
