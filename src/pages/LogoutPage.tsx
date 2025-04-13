
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function LogoutPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
        toast.success("Sessão encerrada com sucesso!");
        navigate("/");
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
        toast.error("Erro ao encerrar a sessão");
        navigate("/");
      }
    };

    handleLogout();
  }, [logout, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Saindo...</p>
      </div>
    </div>
  );
}
