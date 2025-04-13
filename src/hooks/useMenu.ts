
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getRestaurantByUserId } from "@/services/restaurantService";
import {
  Category,
  MenuLevel,
  MenuOption,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getMenuLevels,
  createMenuLevel,
  getMenuOptions,
  createMenuOption
} from "@/services/menuService";

export function useMenu() {
  const { user } = useAuth();
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [levels, setLevels] = useState<MenuLevel[]>([]);
  const [options, setOptions] = useState<Record<number, MenuOption[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadRestaurantData = async () => {
      if (!user?.id) return;
      
      try {
        const restaurant = await getRestaurantByUserId(user.id);
        if (restaurant) {
          setRestaurantId(restaurant.id);
          await loadMenuData(restaurant.id);
        } else {
          toast.error("Não foi possível encontrar informações do seu estabelecimento.");
        }
      } catch (error) {
        console.error("Erro ao carregar dados do restaurante:", error);
        toast.error("Erro ao carregar dados do estabelecimento.");
      } finally {
        setIsLoading(false);
      }
    };

    loadRestaurantData();
  }, [user?.id]);

  const loadMenuData = async (restaurantId: number) => {
    setIsLoading(true);
    try {
      const [categoriesData, levelsData] = await Promise.all([
        getCategories(restaurantId),
        getMenuLevels(restaurantId)
      ]);
      
      setCategories(categoriesData);
      setLevels(levelsData);
      
      // Carregar opções para cada nível
      const optionsMap: Record<number, MenuOption[]> = {};
      await Promise.all(
        levelsData.map(async (level) => {
          const levelOptions = await getMenuOptions(level.id);
          optionsMap[level.id] = levelOptions;
        })
      );
      
      setOptions(optionsMap);
    } catch (error) {
      console.error("Erro ao carregar dados do menu:", error);
      toast.error("Erro ao carregar dados do menu.");
    } finally {
      setIsLoading(false);
    }
  };

  const addCategory = async (categoryData: Partial<Category>): Promise<boolean> => {
    if (!restaurantId) {
      toast.error("Estabelecimento não identificado.");
      return false;
    }
    
    try {
      const newCategory = await createCategory({
        ...categoryData,
        estabelecimento_id: restaurantId
      });
      
      if (newCategory) {
        setCategories(prev => [...prev, newCategory]);
        toast.success("Categoria adicionada com sucesso!");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      toast.error("Erro ao adicionar categoria.");
      return false;
    }
  };

  const updateCategoryItem = async (id: number, categoryData: Partial<Category>): Promise<boolean> => {
    try {
      const updatedCategory = await updateCategory(id, categoryData);
      
      if (updatedCategory) {
        setCategories(prev => prev.map(cat => cat.id === id ? updatedCategory : cat));
        toast.success("Categoria atualizada com sucesso!");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      toast.error("Erro ao atualizar categoria.");
      return false;
    }
  };

  const removeCategory = async (id: number): Promise<boolean> => {
    try {
      const success = await deleteCategory(id);
      
      if (success) {
        setCategories(prev => prev.filter(cat => cat.id !== id));
        toast.success("Categoria excluída com sucesso!");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      toast.error("Erro ao excluir categoria.");
      return false;
    }
  };

  const addLevel = async (levelData: { 
    nome: string; 
    qtd_opcoes_min?: number; 
    qtd_opcoes_max?: number; 
    ativo?: boolean; 
    obrigatorio?: boolean;
  }): Promise<boolean> => {
    if (!restaurantId) {
      toast.error("Estabelecimento não identificado.");
      return false;
    }
    
    try {
      const newLevel = await createMenuLevel({
        ...levelData,
        estabelecimento_id: restaurantId
      });
      
      if (newLevel) {
        setLevels(prev => [...prev, newLevel]);
        setOptions(prev => ({ ...prev, [newLevel.id]: [] }));
        toast.success("Nível adicionado com sucesso!");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erro ao adicionar nível:", error);
      toast.error("Erro ao adicionar nível.");
      return false;
    }
  };

  const addOption = async (optionData: {
    nome: string;
    valor?: number;
    nivel_id: number;
    ativo?: boolean;
  }): Promise<boolean> => {
    if (!optionData.nivel_id) {
      toast.error("Nível não especificado.");
      return false;
    }
    
    try {
      const newOption = await createMenuOption(optionData);
      
      if (newOption) {
        setOptions(prev => ({
          ...prev,
          [newOption.nivel_id]: [...(prev[newOption.nivel_id] || []), newOption]
        }));
        toast.success("Opção adicionada com sucesso!");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erro ao adicionar opção:", error);
      toast.error("Erro ao adicionar opção.");
      return false;
    }
  };

  // Recarregar todos os dados
  const refreshData = async () => {
    if (restaurantId) {
      await loadMenuData(restaurantId);
    }
  };

  return {
    restaurantId,
    categories,
    levels,
    options,
    isLoading,
    addCategory,
    updateCategoryItem,
    removeCategory,
    addLevel,
    addOption,
    refreshData
  };
}
