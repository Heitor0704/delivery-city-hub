
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash } from "lucide-react";

interface OptionFormData {
  name: string;
  price: string;
  level: string;
  active: boolean;
}

interface OptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (optionData: OptionFormData) => void;
  editMode?: boolean;
  initialData?: OptionFormData;
}

export function OptionDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  editMode = false,
  initialData
}: OptionDialogProps) {
  const [optionForm, setOptionForm] = useState<OptionFormData>(
    initialData || {
      name: "",
      price: "0,00",
      level: "",
      active: true,
    }
  );

  const { toast } = useToast();

  const handleOptionChange = (field: string, value: any) => {
    setOptionForm({ ...optionForm, [field]: value });
  };

  const handleSaveOption = () => {
    // Validate form
    if (!optionForm.name || !optionForm.level) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e nível são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Pass data back to parent
    onSave(optionForm);
    
    // Reset form if not in edit mode
    if (!editMode) {
      setOptionForm({ name: "", price: "0,00", level: "", active: true });
    }
  };

  // Lista de níveis disponíveis
  const menuLevels = [
    { id: "1", name: "Proteína" },
    { id: "2", name: "Tamanho" },
    { id: "3", name: "Ponto da Carne" },
    { id: "4", name: "Acompanhamentos" },
    { id: "5", name: "Molhos" },
    { id: "6", name: "Adicionais" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-fomex-orange">
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M2 0H14C15.1 0 16 0.9 16 2V18C16 19.1 15.1 20 14 20H2C0.9 20 0 19.1 0 18V2C0 0.9 0.9 0 2 0ZM2 2V18H14V2H2ZM7 14H9V16H7V14ZM7 4H9V12H7V4Z" fill="#f97316"/>
            </svg>
            {editMode ? "Editar Opção" : "Opções de Nível de Cardápio"}
          </DialogTitle>
          <DialogDescription>
            {editMode 
              ? "Edite os detalhes desta opção do cardápio." 
              : "Crie uma nova opção para seus produtos."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 gap-3">
            <Label htmlFor="option-name" className="font-medium text-gray-700">
              Nome:
            </Label>
            <Input
              id="option-name"
              placeholder="Nome da opção"
              value={optionForm.name}
              onChange={(e) => handleOptionChange("name", e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <Label htmlFor="option-level" className="font-medium text-gray-700">
              Nível de Cardápio:
            </Label>
            <Select
              value={optionForm.level}
              onValueChange={(value) => handleOptionChange("level", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Escolha um nível" />
              </SelectTrigger>
              <SelectContent>
                {menuLevels.map((level) => (
                  <SelectItem key={level.id} value={level.name}>{level.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <Label htmlFor="option-price" className="font-medium text-gray-700">
              Valor (R$)
            </Label>
            <Input
              id="option-price"
              type="text"
              placeholder="0,00"
              value={optionForm.price}
              onChange={(e) => handleOptionChange("price", e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <Label className="font-medium text-gray-700">Ativo?</Label>
            <RadioGroup
              value={optionForm.active ? "sim" : "nao"}
              onValueChange={(value) => handleOptionChange("active", value === "sim")}
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
          {editMode && (
            <Button 
              variant="destructive" 
              onClick={() => onOpenChange(false)}
              className="flex items-center"
            >
              <Trash className="mr-2 h-4 w-4" />
              Excluir Opção de Nível
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
              onClick={handleSaveOption}
              className="bg-fomex-orange hover:bg-fomex-orange/90"
            >
              {editMode ? "Editar Opção de Nível" : "Salvar"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
