
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Restaurant, 
  Order, 
  OrderStats, 
  SalesByMonth, 
  OrdersByDay, 
  CategorySales,
  getRestaurantByUserId, 
  getRecentOrders,
  getOrderStats,
  getSalesByMonth,
  getOrdersByDay,
  getCategorySales
} from "@/services/restaurantService";
import { toast } from "sonner";

export function useRestaurant() {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [salesByMonth, setSalesByMonth] = useState<SalesByMonth[]>([]);
  const [ordersByDay, setOrdersByDay] = useState<OrdersByDay[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);

  useEffect(() => {
    const loadRestaurantData = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const restaurantData = await getRestaurantByUserId(user.id);
        
        if (restaurantData) {
          setRestaurant(restaurantData);
          
          // Carregar dados relacionados
          const [
            orders,
            stats,
            sales,
            orderDays,
            categories
          ] = await Promise.all([
            getRecentOrders(restaurantData.id),
            getOrderStats(restaurantData.id),
            getSalesByMonth(restaurantData.id),
            getOrdersByDay(restaurantData.id),
            getCategorySales(restaurantData.id)
          ]);
          
          setRecentOrders(orders);
          setOrderStats(stats);
          setSalesByMonth(sales);
          setOrdersByDay(orderDays);
          setCategorySales(categories);
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

  return {
    restaurant,
    isLoading,
    recentOrders,
    orderStats,
    salesByMonth,
    ordersByDay,
    categorySales
  };
}
