
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Trash, Save, Layers } from "lucide-react";

interface LevelFormData {
  name: string;
  min: string;
  max: string;
  active: boolean;
  isAddon?: boolean;
}

interface LevelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (levelData: LevelFormData) => void;
  onDelete?: () => void;
  editMode?: boolean;
  initialData?: LevelFormData;
}

export function LevelDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  onDelete,
  editMode = false,
  initialData
}: LevelDialogProps) {
  const [levelForm, setLevelForm] = useState<LevelFormData>(
    initialData || {
      name: "",
      min: "0",
      max: "1",
      active: true,
      isAddon: false
    }
  );

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
    
    // Reset form if not in edit mode
    if (!editMode) {
      setLevelForm({ name: "", min: "0", max: "1", active: true, isAddon: false });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-fomex-orange">
            <Layers className="mr-2 h-5 w-5" />
            {editMode ? "Editar Nível" : "Novo Nível do Cardápio"}
          </DialogTitle>
          <DialogDescription>
            {editMode 
              ? "Edite os detalhes deste nível do cardápio." 
              : "Crie um novo nível para organizar as opções do seu cardápio."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 gap-3">
            <Label htmlFor="level-name" className="font-medium text-gray-700">
              Nome do nível:
            </Label>
            <Input
              id="level-name"
              placeholder="Ex: Proteínas, Tamanhos, Acompanhamentos..."
              value={levelForm.name}
              onChange={(e) => handleLevelChange("name", e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <Label className="font-medium text-gray-700">Tipo de nível:</Label>
            <RadioGroup
              value={levelForm.isAddon ? "addon" : "regular"}
              onValueChange={(value) => handleLevelChange("isAddon", value === "addon")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="type-regular" />
                <Label htmlFor="type-regular">Nível Regular</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="addon" id="type-addon" />
                <Label htmlFor="type-addon">Adicional (com valor)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level-min" className="font-medium text-gray-700 flex items-center">
                Quantidade mínima de opções:
                <span className="ml-2 text-xs text-orange-500">
                  (Padrão: 0 | *Maior que 0: Obrigatório)
                </span>
              </Label>
              <Input
                id="level-min"
                type="number"
                min="0"
                placeholder="0"
                value={levelForm.min}
                onChange={(e) => handleLevelChange("min", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="level-max" className="font-medium text-gray-700">
                Quantidade máxima de opções:
                <span className="ml-2 text-xs text-gray-500">
                  (Padrão: 1)
                </span>
              </Label>
              <Input
                id="level-max"
                type="number"
                min="1"
                placeholder="1"
                value={levelForm.max}
                onChange={(e) => handleLevelChange("max", e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <Label className="font-medium text-gray-700">Ativo?</Label>
            <RadioGroup
              value={levelForm.active ? "sim" : "nao"}
              onValueChange={(value) => handleLevelChange("active", value === "sim")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="active-yes" />
                <Label htmlFor="active-yes">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="active-no" />
                <Label htmlFor="active-no">Não</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between space-x-4">
          {editMode && onDelete && (
            <Button 
              variant="destructive" 
              onClick={onDelete}
              className="flex items-center"
            >
              <Trash className="mr-2 h-4 w-4" />
              Excluir Nível
            </Button>
          )}
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-gray-300"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveLevel}
              className="bg-fomex-orange hover:bg-fomex-orange/90 flex items-center"
            >
              <Save className="mr-2 h-4 w-4" />
              {editMode ? "Atualizar Nível" : "Criar Nível"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
