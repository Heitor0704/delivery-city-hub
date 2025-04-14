
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const initialCategories = [
  { id: 1, nome: "Hambúrgueres", descricao: "Hambúrgueres artesanais", imagem: "burger.jpg", ativo: true },
  { id: 2, nome: "Pizzas", descricao: "Pizzas tradicionais e premium", imagem: "pizza.jpg", ativo: true },
  { id: 3, nome: "Bebidas", descricao: "Refrigerantes, sucos e bebidas alcoólicas", imagem: "drinks.jpg", ativo: true },
  { id: 4, nome: "Sobremesas", descricao: "Doces e sobremesas", imagem: "dessert.jpg", ativo: true },
  { id: 5, nome: "Combos", descricao: "Combos promocionais", imagem: "combo.jpg", ativo: false },
];

interface CategoryEditFormProps {
  category: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (category: any) => void;
}

function CategoryEditForm({ category, open, onOpenChange, onSave }: CategoryEditFormProps) {
  const [editedCategory, setEditedCategory] = useState({...category});
  const { toast } = useToast();
  
  const handleChange = (field: string, value: any) => {
    setEditedCategory({...editedCategory, [field]: value});
  };
  
  const handleSubmit = () => {
    if (!editedCategory.nome) {
      toast({
        title: "Campo obrigatório",
        description: "Nome da categoria é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    onSave(editedCategory);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
          <DialogDescription>
            Edite os detalhes da categoria {category.nome}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input 
              id="name" 
              value={editedCategory.nome} 
              onChange={(e) => handleChange("nome", e.target.value)}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <Input 
              id="description" 
              value={editedCategory.descricao} 
              onChange={(e) => handleChange("descricao", e.target.value)}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Imagem
            </Label>
            <Input 
              id="image" 
              type="file" 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="active" className="text-right">
              Ativo
            </Label>
            <div className="col-span-3 flex items-center">
              <Switch 
                id="active" 
                checked={editedCategory.ativo} 
                onCheckedChange={(checked) => handleChange("ativo", checked)} 
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface CategoryListProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function CategoryList({ onEdit, onDelete }: CategoryListProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleEdit = (id: string | number) => {
    const category = categories.find(cat => cat.id.toString() === id.toString());
    if (category) {
      setEditingCategory(category);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleSaveEdit = (updatedCategory: any) => {
    const updatedCategories = categories.map(cat => 
      cat.id === updatedCategory.id ? updatedCategory : cat
    );
    setCategories(updatedCategories);
    
    toast({
      title: "Categoria atualizada",
      description: `A categoria '${updatedCategory.nome}' foi atualizada com sucesso.`
    });
  };

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.nome}</TableCell>
                  <TableCell>{category.descricao}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      category.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {category.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEdit(category.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => onDelete && onDelete(category.id.toString())}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {editingCategory && (
        <CategoryEditForm 
          category={editingCategory} 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
}
