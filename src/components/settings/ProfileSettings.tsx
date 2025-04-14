
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Camera, Loader2 } from 'lucide-react';

export function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.full_name || '');
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setAvatar(event.target.result);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, you would upload the file to a server/storage
      // and get back a URL to set in the user profile
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user in context
      updateUser({
        ...user!,
        full_name: name,
        avatar: avatar || undefined,
      });
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações de perfil foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar seu perfil. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Informações de Perfil</CardTitle>
          <CardDescription>
            Atualize suas informações pessoais e foto de perfil.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center sm:flex-row sm:space-x-4">
            <div className="relative mb-4 sm:mb-0">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatar || ""} />
                <AvatarFallback className="text-xl bg-fomex-orange text-white">
                  {getInitials(name || user?.email || "")}
                </AvatarFallback>
              </Avatar>
              
              <Label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 bg-fomex-orange rounded-full cursor-pointer shadow-lg"
              >
                <Camera size={16} className="text-white" />
                <Input 
                  type="file" 
                  id="avatar-upload" 
                  accept="image/*" 
                  className="sr-only" 
                  onChange={handleFileChange}
                />
              </Label>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">Nome</Label>
                <Input 
                  type="text" 
                  id="name" 
                  placeholder="Seu nome" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input 
                  type="email" 
                  id="email" 
                  placeholder="seu-email@exemplo.com" 
                  value={user?.email} 
                  disabled 
                />
                <p className="text-sm text-muted-foreground">
                  O email não pode ser alterado.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar alterações
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
