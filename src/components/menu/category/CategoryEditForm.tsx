
import { useState } from "react";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Category } from "./types";

interface CategoryEditFormProps {
  category: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (category: Category) => void;
}

export function CategoryEditForm({ 
  category, 
  open, 
  onOpenChange, 
  onSave 
}: CategoryEditFormProps) {
  const [editedCategory, setEditedCategory] = useState<Category>({...category});
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
