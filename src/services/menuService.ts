
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
  estabelecimento_id: number;
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

// Products
export interface Product {
  id: number;
  nome_produto: string;
  descricao: string;
  preco: number;
  foto: string;
  categoria_id: number;
  estabelecimento_id: number;
  destaque: boolean;
  status: string;
  created_at: string;
}

export async function getProducts(restaurantId: number): Promise<Product[]> {
  const { data, error } = await supabase
    .from("Produto")
    .select("*")
    .eq("estabelecimento_id", restaurantId)
    .order("nome_produto");

  if (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }

  return data || [];
}

export async function createProduct(product: Partial<Product>): Promise<Product | null> {
  const { data, error } = await supabase
    .from("Produto")
    .insert([product])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar produto:", error);
    return null;
  }

  return data;
}

export async function updateProduct(id: number, product: Partial<Product>): Promise<Product | null> {
  const { data, error } = await supabase
    .from("Produto")
    .update(product)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar produto:", error);
    return null;
  }

  return data;
}

export async function deleteProduct(id: number): Promise<boolean> {
  const { error } = await supabase
    .from("Produto")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao excluir produto:", error);
    return false;
  }

  return true;
}

export async function toggleProductAvailability(id: number, isAvailable: boolean): Promise<boolean> {
  const { error } = await supabase
    .from("Produto")
    .update({ status: isAvailable ? "disponível" : "indisponível" })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar disponibilidade do produto:", error);
    return false;
  }

  return true;
}

export async function toggleProductFeatured(id: number, isFeatured: boolean): Promise<boolean> {
  const { error } = await supabase
    .from("Produto")
    .update({ destaque: isFeatured })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar destaque do produto:", error);
    return false;
  }

  return true;
}
