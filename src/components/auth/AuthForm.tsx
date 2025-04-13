
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email || !password) {
        toast.error("Por favor, preencha todos os campos.");
        setIsLoading(false);
        return;
      }

      await login(email, password);
      
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      toast.error("Erro: " + (error instanceof Error ? error.message : "Credenciais inválidas"));
    } finally {
      setIsLoading(false);
    }
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
            Entrar
          </h2>
          
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
            {isLoading ? "Processando..." : "ENTRAR"}
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
        </form>
      </CardContent>
    </Card>
  );
}
