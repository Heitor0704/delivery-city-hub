
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

type UserRole = "owner" | "cityManager" | "admin";

// Demo user credentials for testing
const DEMO_USERS = {
  owner: { email: "dono@fomex.com", password: "123456", role: "owner" },
  cityManager: { email: "gerente@fomex.com", password: "123456", role: "cityManager" },
  admin: { email: "admin@fomex.com", password: "123456", role: "admin" },
};

export default function AuthForm() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("owner");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validar campos
      if (!email || !password) {
        toast.error("Por favor, preencha todos os campos.");
        return;
      }

      // Fazer login
      await login(email, password);
      
      // Redirecionar após login bem-sucedido
      toast.success("Login realizado com sucesso!");
      
      // Ao fazer login, a redireção acontecerá automaticamente pelo Index.tsx
      navigate("/");
    } catch (error) {
      toast.error("Erro ao fazer login: " + (error instanceof Error ? error.message : "Credenciais inválidas"));
    }
  };

  const fillDemoCredentials = (userType: keyof typeof DEMO_USERS) => {
    const demoUser = DEMO_USERS[userType];
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setRole(demoUser.role as UserRole);
    toast.info(`Credenciais de ${userType} preenchidas. Clique em "Entrar" para fazer login.`);
  };

  return (
    <Card className="w-[380px] shadow-lg bg-white/95 border-none rounded-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col items-center p-6 pb-0">
          <div className="mb-6 flex flex-col items-center">
            <img 
              src="/lovable-uploads/8724e30c-5320-4840-9c82-f95d7aa3af29.png" 
              alt="FomeX Logo" 
              className="w-32 h-32 object-contain"
            />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite a sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-gray-700 font-medium">Tipo de Usuário</Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger className="border-gray-300 focus:border-orange-500">
                <SelectValue placeholder="Selecione o tipo de usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Dono do Estabelecimento</SelectItem>
                <SelectItem value="cityManager">Gerente da Cidade</SelectItem>
                <SelectItem value="admin">Dono do Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-md transition"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : "ENTRAR"}
          </Button>
          <div className="flex justify-center mt-4">
            <button 
              type="button" 
              className="text-orange-600 hover:text-orange-800 text-sm"
              onClick={() => toast.info("Função de recuperar senha em desenvolvimento")}
            >
              Esqueci minha senha
            </button>
          </div>
          <div className="flex justify-center mt-2 text-sm text-gray-600">
            Não tem login? <a href="#" className="text-orange-600 hover:text-orange-800 ml-1">Cadastre-se</a>
          </div>

          {/* Demo logins */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-2">Demonstração:</p>
            <div className="flex justify-between space-x-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials("owner")}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 flex-1"
              >
                Demo Dono
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials("cityManager")}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 flex-1"
              >
                Demo Gerente
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials("admin")}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 flex-1"
              >
                Demo Admin
              </button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
