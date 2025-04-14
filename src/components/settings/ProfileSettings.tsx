
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Loader2 } from "lucide-react";

const profileFormSchema = z.object({
  full_name: z.string().min(2, {
    message: "Nome completo precisa ter pelo menos 2 caracteres.",
  }),
  avatar: z.instanceof(FileList).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatar);

  const defaultValues: Partial<ProfileFormValues> = {
    full_name: user?.full_name || "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    try {
      let avatarPath = user?.avatar;

      // Handle file upload if a new avatar is selected
      if (data.avatar && data.avatar.length > 0) {
        const file = data.avatar[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}-avatar-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        // Upload the file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`Erro ao fazer upload da imagem: ${uploadError.message}`);
        }

        // Get the public URL
        const { data: urlData } = await supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        avatarPath = urlData.publicUrl;
      }

      // Update the user profile with the new data
      if (user) {
        await supabase
          .from('profiles')
          .update({
            full_name: data.full_name,
            avatar: avatarPath,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        // Update local state
        updateUser({
          ...user,
          full_name: data.full_name,
          avatar: avatarPath,
        });

        setAvatarUrl(avatarPath);
        toast.success("Perfil atualizado com sucesso!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(`Erro ao atualizar perfil: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>
          Atualize suas informações de perfil.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="flex justify-center mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl || ""} />
                <AvatarFallback className="bg-fomex-orange text-white text-2xl">
                  {user ? getInitials(user.full_name || user.email || "") : "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome completo" {...field} />
                  </FormControl>
                  <FormDescription>
                    Este é o nome que será exibido em seu perfil.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="avatar"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Foto de perfil</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormDescription>
                    Escolha uma foto de perfil. Formatos aceitos: JPG, PNG.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input value={user?.email || ""} disabled />
              </FormControl>
              <FormDescription>
                Seu email de acesso. Não pode ser alterado.
              </FormDescription>
            </FormItem>
            
            <FormItem>
              <FormLabel>Função</FormLabel>
              <FormControl>
                <Input 
                  value={
                    user?.role === "owner" ? "Dono do Estabelecimento" :
                    user?.role === "cityManager" ? "Gerente da Cidade" :
                    user?.role === "admin" ? "Administrador" :
                    "Cliente"
                  } 
                  disabled 
                />
              </FormControl>
              <FormDescription>
                Sua função no sistema. Não pode ser alterada.
              </FormDescription>
            </FormItem>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar alterações
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
