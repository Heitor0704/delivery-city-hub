
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Dados simulados de categorias
const categories = [
  { id: 1, nome: "Hambúrgueres", descricao: "Lanches e hambúrgueres", estabelecimentos: 15 },
  { id: 2, nome: "Pizzas", descricao: "Pizzarias e massas italianas", estabelecimentos: 12 },
  { id: 3, nome: "Japonesa", descricao: "Sushi, temaki e comida japonesa", estabelecimentos: 8 },
  { id: 4, nome: "Padarias", descricao: "Pães, bolos e café", estabelecimentos: 10 },
  { id: 5, nome: "Chinesa", descricao: "Comida chinesa e asiática", estabelecimentos: 5 },
  { id: 6, nome: "Brasileira", descricao: "Pratos típicos brasileiros", estabelecimentos: 14 },
  { id: 7, nome: "Saudável", descricao: "Alimentação saudável e fit", estabelecimentos: 7 },
  { id: 8, nome: "Doces", descricao: "Sobremesas, doces e sorvetes", estabelecimentos: 9 },
  { id: 9, nome: "Bebidas", descricao: "Bebidas alcoólicas e não alcoólicas", estabelecimentos: 3 },
];

// Schema de validação para categorias
const categoryFormSchema = z.object({
  nome: z.string().min(3, { message: "O nome precisa ter pelo menos 3 caracteres" }),
  descricao: z.string().min(5, { message: "A descrição precisa ter pelo menos 5 caracteres" }),
});

export default function CityManagerRegistrations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      nome: "",
      descricao: "",
    },
  });

  const editForm = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      nome: "",
      descricao: "",
    },
  });

  const filteredCategories = categories.filter((category) =>
    category.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openNewCategoryDialog = () => {
    form.reset();
    setIsNewCategoryOpen(true);
  };

  const openEditCategoryDialog = (category: any) => {
    setSelectedCategory(category);
    editForm.reset({
      nome: category.nome,
      descricao: category.descricao,
    });
    setIsEditCategoryOpen(true);
  };

  const openDeleteDialog = (category: any) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const onSubmitNewCategory = (data: z.infer<typeof categoryFormSchema>) => {
    console.log("Nova categoria:", data);
    // Aqui implementaríamos a criação da categoria no backend
    toast({
      title: "Categoria criada",
      description: `${data.nome} foi adicionada com sucesso.`,
    });
    setIsNewCategoryOpen(false);
  };

  const onSubmitEditCategory = (data: z.infer<typeof categoryFormSchema>) => {
    if (!selectedCategory) return;
    
    console.log("Categoria atualizada:", data);
    // Aqui implementaríamos a atualização da categoria no backend
    toast({
      title: "Categoria atualizada",
      description: `${data.nome} foi atualizada com sucesso.`,
    });
    setIsEditCategoryOpen(false);
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory) return;
    
    console.log("Categoria excluída:", selectedCategory);
    // Aqui implementaríamos a exclusão da categoria no backend
    toast({
      title: "Categoria excluída",
      description: `${selectedCategory.nome} foi excluída com sucesso.`,
    });
    setIsDeleteDialogOpen(false);
  };

  return (
    <PageLayout 
      title="Gerenciar Categorias"
      description="Gerencie as categorias de estabelecimentos da sua cidade."
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar categorias..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            size="sm" 
            className="bg-fomex-orange hover:bg-fomex-orange/90"
            onClick={openNewCategoryDialog}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Categoria
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Estabelecimentos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{category.nome}</TableCell>
                      <TableCell>{category.descricao}</TableCell>
                      <TableCell>{category.estabelecimentos}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openEditCategoryDialog(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openDeleteDialog(category)}
                            disabled={category.estabelecimentos > 0}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      Nenhuma categoria encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Dicas para Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Crie categorias claras e específicas para facilitar a busca dos clientes.</li>
              <li>Categorias com nomes atrativos chamam mais atenção dos usuários.</li>
              <li>Não é possível excluir categorias que possuem estabelecimentos associados.</li>
              <li>Descrições detalhadas ajudam os estabelecimentos a escolherem a categoria correta.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Modal de nova categoria */}
        <Dialog open={isNewCategoryOpen} onOpenChange={setIsNewCategoryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Categoria</DialogTitle>
              <DialogDescription>
                Adicione uma nova categoria para os estabelecimentos.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitNewCategory)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da categoria" {...field} />
                      </FormControl>
                      <FormDescription>
                        Este nome será exibido na listagem de categorias da aplicação.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input placeholder="Descrição da categoria" {...field} />
                      </FormControl>
                      <FormDescription>
                        Uma breve descrição do que esta categoria representa.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsNewCategoryOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Modal de edição de categoria */}
        <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Categoria</DialogTitle>
              <DialogDescription>
                Atualize os dados da categoria selecionada.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onSubmitEditCategory)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da categoria" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input placeholder="Descrição da categoria" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditCategoryOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar alterações</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Diálogo de confirmação para excluir categoria */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Categoria</AlertDialogTitle>
              <AlertDialogDescription>
                {selectedCategory?.estabelecimentos > 0
                  ? `Não é possível excluir esta categoria porque ela possui ${selectedCategory?.estabelecimentos} estabelecimentos associados.`
                  : `Tem certeza que deseja excluir a categoria "${selectedCategory?.nome}"? Esta ação não pode ser desfeita.`
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              {selectedCategory?.estabelecimentos === 0 && (
                <AlertDialogAction
                  onClick={handleDeleteCategory}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Excluir
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageLayout>
  );
}
