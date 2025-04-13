
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

type UserRole = "owner" | "cityManager" | "admin";

// Demo user credentials for testing
const DEMO_USERS = {
  owner: { email: "dono@fomex.com", password: "123456", role: "owner", name: "Dono Demo" },
  cityManager: { email: "gerente@fomex.com", password: "123456", role: "cityManager", name: "Gerente Demo" },
  admin: { email: "admin@fomex.com", password: "123456", role: "admin", name: "Admin Demo" },
};

export default function AuthForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingDemo, setIsCreatingDemo] = useState<string | null>(null);

  // Função para criar usuários demo via Supabase Auth
  const createDemoUser = async (userType: keyof typeof DEMO_USERS) => {
    const demoUser = DEMO_USERS[userType];
    setIsCreatingDemo(userType);
    
    try {
      // Tentar fazer login com as credenciais do usuário demo primeiro
      // Se o login falhar, criamos um novo usuário
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: demoUser.email,
        password: demoUser.password,
      });
      
      if (loginError) {
        console.log("Usuário demo não existe, criando novo usuário...");
        
        // Criar um novo usuário
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: demoUser.email,
          password: demoUser.password,
          options: {
            data: {
              nome_usuario: demoUser.name,
              tipo_usuario: demoUser.role
            }
          }
        });

        if (signUpError) {
          toast.error(`Erro ao criar usuário demo: ${signUpError.message}`);
          console.error("Erro ao criar usuário:", signUpError);
          return;
        }
        
        toast.success(`Usuário demo ${userType} criado com sucesso!`);
        
        // Adicionar um pequeno atraso para garantir que o trigger tenha tempo de executar
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Fazer login com o usuário recém-criado
        await login(demoUser.email, demoUser.password);
      } else {
        // Se o login foi bem-sucedido, o usuário já existe
        toast.success(`Login com usuário demo ${userType} realizado com sucesso!`);
      }
    } catch (error) {
      toast.error(`Erro inesperado: ${error instanceof Error ? error.message : String(error)}`);
      console.error("Erro:", error);
    } finally {
      setIsCreatingDemo(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar campos
      if (!email || !password) {
        toast.error("Por favor, preencha todos os campos.");
        return;
      }

      // Fazer login usando o Supabase através do nosso contexto de autenticação
      await login(email, password);
      
      // Mostrar mensagem de sucesso
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Erro ao fazer login: " + (error instanceof Error ? error.message : "Credenciais inválidas"));
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (userType: keyof typeof DEMO_USERS) => {
    const demoUser = DEMO_USERS[userType];
    setEmail(demoUser.email);
    setPassword(demoUser.password);
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

          <Button 
            type="submit" 
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-md transition"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "ENTRAR"}
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

          {/* Demo logins section */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-2">Acesso Rápido Demo:</p>
            <div className="grid grid-cols-1 gap-2">
              {/* Login imediato (combinado criar + login) */}
              <div className="flex justify-between space-x-2">
                <Button 
                  type="button"
                  onClick={() => createDemoUser("owner")}
                  disabled={!!isCreatingDemo}
                  variant="outline"
                  className="text-xs py-1 flex-1 h-auto"
                >
                  {isCreatingDemo === "owner" ? (
                    <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Dono</>
                  ) : "Login Dono"}
                </Button>
                <Button 
                  type="button"
                  onClick={() => createDemoUser("cityManager")}
                  disabled={!!isCreatingDemo}
                  variant="outline"
                  className="text-xs py-1 flex-1 h-auto"
                >
                  {isCreatingDemo === "cityManager" ? (
                    <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Gerente</>
                  ) : "Login Gerente"}
                </Button>
                <Button 
                  type="button"
                  onClick={() => createDemoUser("admin")}
                  disabled={!!isCreatingDemo}
                  variant="outline"
                  className="text-xs py-1 flex-1 h-auto"
                >
                  {isCreatingDemo === "admin" ? (
                    <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Admin</>
                  ) : "Login Admin"}
                </Button>
              </div>

              {/* Preencher credenciais apenas */}
              <div className="flex justify-between space-x-2">
                <Button 
                  type="button"
                  onClick={() => fillDemoCredentials("owner")}
                  disabled={!!isCreatingDemo || isLoading}
                  variant="ghost"
                  className="text-xs py-1 flex-1 h-auto text-gray-500"
                >
                  Preencher Dono
                </Button>
                <Button 
                  type="button"
                  onClick={() => fillDemoCredentials("cityManager")}
                  disabled={!!isCreatingDemo || isLoading}
                  variant="ghost"
                  className="text-xs py-1 flex-1 h-auto text-gray-500"
                >
                  Preencher Gerente
                </Button>
                <Button 
                  type="button"
                  onClick={() => fillDemoCredentials("admin")}
                  disabled={!!isCreatingDemo || isLoading}
                  variant="ghost"
                  className="text-xs py-1 flex-1 h-auto text-gray-500"
                >
                  Preencher Admin
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
