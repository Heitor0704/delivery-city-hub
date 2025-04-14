
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface CategoryFormData {
  name: string;
  description: string;
  active: boolean;
}

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (categoryData: CategoryFormData) => void;
}

export function CategoryDialog({ open, onOpenChange, onSave }: CategoryDialogProps) {
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    name: "",
    description: "",
    active: true,
  });

  const { toast } = useToast();

  const handleCategoryChange = (field: string, value: any) => {
    setCategoryForm({ ...categoryForm, [field]: value });
  };

  const handleSaveCategory = () => {
    // Validate form
    if (!categoryForm.name) {
      toast({
        title: "Campo obrigatório",
        description: "Nome da categoria é obrigatório",
        variant: "destructive",
      });
      return;
    }

    // Pass data back to parent
    onSave(categoryForm);
    
    // Reset form and close dialog
    setCategoryForm({ name: "", description: "", active: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Categoria</DialogTitle>
          <DialogDescription>
            Crie uma nova categoria para o seu cardápio.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              placeholder="Nome da categoria"
              value={categoryForm.name}
              onChange={(e) => handleCategoryChange("name", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <Textarea
              id="description"
              placeholder="Descrição (opcional)"
              value={categoryForm.description}
              onChange={(e) => handleCategoryChange("description", e.target.value)}
              className="col-span-3"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Imagem
            </Label>
            <Input id="image" type="file" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="active" className="text-right">
              Ativo
            </Label>
            <div className="col-span-3 flex items-center">
              <Switch
                id="active"
                checked={categoryForm.active}
                onCheckedChange={(checked) => handleCategoryChange("active", checked)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveCategory}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
