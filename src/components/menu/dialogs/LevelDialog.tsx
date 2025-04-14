
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
import { useToast } from "@/hooks/use-toast";

interface LevelFormData {
  name: string;
  min: string;
  max: string;
  active: boolean;
}

interface LevelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (levelData: LevelFormData) => void;
}

export function LevelDialog({ open, onOpenChange, onSave }: LevelDialogProps) {
  const [levelForm, setLevelForm] = useState<LevelFormData>({
    name: "",
    min: "0",
    max: "1",
    active: true,
  });

  const { toast } = useToast();

  const handleLevelChange = (field: string, value: any) => {
    setLevelForm({ ...levelForm, [field]: value });
  };

  const handleSaveLevel = () => {
    // Validate form
    if (!levelForm.name) {
      toast({
        title: "Campo obrigatório",
        description: "Nome do nível é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (Number(levelForm.min) > Number(levelForm.max)) {
      toast({
        title: "Valores inválidos",
        description: "O mínimo não pode ser maior que o máximo",
        variant: "destructive",
      });
      return;
    }

    // Pass data back to parent
    onSave(levelForm);
    
    // Reset form and close dialog
    setLevelForm({ name: "", min: "0", max: "1", active: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nível</DialogTitle>
          <DialogDescription>
            Crie um novo nível para personalizar seus produtos.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level-name" className="text-right">
              Nome
            </Label>
            <Input
              id="level-name"
              placeholder="Nome do nível"
              value={levelForm.name}
              onChange={(e) => handleLevelChange("name", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level-min" className="text-right">
              Mínimo
            </Label>
            <Input
              id="level-min"
              type="number"
              min="0"
              placeholder="0"
              value={levelForm.min}
              onChange={(e) => handleLevelChange("min", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level-max" className="text-right">
              Máximo
            </Label>
            <Input
              id="level-max"
              type="number"
              min="1"
              placeholder="1"
              value={levelForm.max}
              onChange={(e) => handleLevelChange("max", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level-active" className="text-right">
              Ativo
            </Label>
            <div className="col-span-3 flex items-center">
              <Switch
                id="level-active"
                checked={levelForm.active}
                onCheckedChange={(checked) => handleLevelChange("active", checked)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveLevel}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
