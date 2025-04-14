
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateTestUsers() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const handleCreateUsers = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      // Call the edge function to create users
      const { data, error } = await supabase.functions.invoke('create-test-users', {
        method: 'POST'
      });

      if (error) throw error;

      setResult({
        success: true,
        message: 'Usuários de teste criados com sucesso!',
        details: data
      });
      
      toast.success('Usuários de teste criados com sucesso!');
    } catch (error) {
      console.error('Erro ao criar usuários:', error);
      setResult({
        success: false,
        message: `Erro ao criar usuários: ${error.message || 'Erro desconhecido'}`,
      });
      
      toast.error(`Erro ao criar usuários: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Criar Usuários de Teste</CardTitle>
          <CardDescription>
            Crie usuários padrão para testar a aplicação com diferentes funções.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Usuários que serão criados:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="font-semibold mr-2 min-w-24">Admin:</span> 
                <div>
                  <div>Email: admin@fomex.com</div>
                  <div>Senha: admin123456</div>
                </div>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2 min-w-24">Gerente:</span> 
                <div>
                  <div>Email: gerente@fomex.com</div>
                  <div>Senha: gerente123456</div>
                </div>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2 min-w-24">Dono:</span> 
                <div>
                  <div>Email: dono@fomex.com</div>
                  <div>Senha: dono123456</div>
                </div>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2 min-w-24">Cliente:</span> 
                <div>
                  <div>Email: cliente@fomex.com</div>
                  <div>Senha: cliente123456</div>
                </div>
              </li>
            </ul>
          </div>

          {result && (
            <div className={`p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className={result.success ? 'text-green-700' : 'text-red-700'}>
                  {result.message}
                </span>
              </div>
              {result.details && (
                <div className="mt-2 text-xs max-h-40 overflow-auto bg-background/70 p-2 rounded">
                  <pre>{JSON.stringify(result.details, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={handleCreateUsers} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando usuários...
              </>
            ) : (
              'Criar usuários de teste'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
