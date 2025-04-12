
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type UserRole = "owner" | "cityManager" | "admin";

export default function AuthForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("owner");
  const [isLoading, setIsLoading] = useState(false);

  // Simulação de autenticação para fins de demonstração
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Aqui seria implementada uma integração real com API/backend para autenticação
      setTimeout(() => {
        // Mock login - em produção seria substituído por verificação real
        if (email && password) {
          // Simula login bem-sucedido
          login({ email, role });
          
          // Redireciona para o dashboard específico do tipo de usuário
          switch (role) {
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
          
          toast.success("Login realizado com sucesso!");
        } else {
          toast.error("Por favor, preencha todos os campos.");
        }
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Erro ao fazer login. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[350px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Acesse sua conta para gerenciar o sistema de delivery
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Tipo de Usuário</Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Dono do Estabelecimento</SelectItem>
                <SelectItem value="cityManager">Gerente da Cidade</SelectItem>
                <SelectItem value="admin">Dono do Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-delivery-primary hover:bg-delivery-dark" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
