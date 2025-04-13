
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type UserRole = "owner" | "cityManager" | "admin";

// Demo user credentials for testing
const DEMO_USERS = {
  owner: { email: "dono@fomex.com", password: "123456", role: "owner" },
  cityManager: { email: "gerente@fomex.com", password: "123456", role: "cityManager" },
  admin: { email: "admin@fomex.com", password: "123456", role: "admin" },
};

export default function AuthForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("owner");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar campos
      if (!email || !password) {
        toast.error("Por favor, preencha todos os campos.");
        setIsLoading(false);
        return;
      }

      if (isRegistering && !name) {
        toast.error("Por favor, informe seu nome.");
        setIsLoading(false);
        return;
      }

      if (isRegistering) {
        // Register new user
        await handleRegister();
      } else {
        // Login existing user
        await login(email, password);
        
        // Redirect based on role
        toast.success("Login realizado com sucesso!");
        navigateByRole(role);
      }
    } catch (error) {
      toast.error("Erro: " + (error instanceof Error ? error.message : "Credenciais inválidas"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw new Error(authError.message);
      
      if (!authData.user) throw new Error("Erro ao criar conta");

      // Create entry in Usuarios table
      const { error: userError } = await supabase
        .from('Usuarios')
        .insert([
          { 
            user_id: authData.user.id,
            nome_usuario: name,
            email: email,
            tipo_usuario: role,
            senha: '', // Don't store actual password
          }
        ]);

      if (userError) throw new Error(userError.message);

      toast.success("Conta criada com sucesso!");
      navigateByRole(role);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const navigateByRole = (userRole: UserRole) => {
    switch (userRole) {
      case "owner":
        navigate("/owner-dashboard");
        break;
      case "cityManager":
        navigate("/city-manager-dashboard");
        break;
      case "admin":
        navigate("/admin-dashboard");
        break;
      default:
        navigate("/");
    }
  };

  const fillDemoCredentials = (userType: keyof typeof DEMO_USERS) => {
    const demoUser = DEMO_USERS[userType];
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setRole(demoUser.role as UserRole);
    toast.info(`Credenciais de ${userType} preenchidas. Clique em "Entrar" para fazer login.`);
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
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
          <h2 className="text-xl font-bold text-center text-gray-800">
            {isRegistering ? "Criar Conta" : "Entrar"}
          </h2>
          
          {isRegistering && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">Nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200"
                required={isRegistering}
              />
            </div>
          )}
          
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
            {isLoading ? "Processando..." : isRegistering ? "CADASTRAR" : "ENTRAR"}
          </Button>
          
          {!isRegistering && (
            <div className="flex justify-center mt-4">
              <button 
                type="button" 
                className="text-orange-600 hover:text-orange-800 text-sm"
                onClick={() => toast.info("Função de recuperar senha em desenvolvimento")}
              >
                Esqueci minha senha
              </button>
            </div>
          )}
          
          <div className="flex justify-center mt-2 text-sm text-gray-600">
            {isRegistering ? "Já tem uma conta?" : "Não tem login?"} 
            <button 
              type="button"
              className="text-orange-600 hover:text-orange-800 ml-1"
              onClick={toggleMode}
            >
              {isRegistering ? "Entre aqui" : "Cadastre-se"}
            </button>
          </div>

          {/* Demo logins - only show in login mode */}
          {!isRegistering && (
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
          )}
        </form>
      </CardContent>
    </Card>
  );
}
