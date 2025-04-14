
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Trash, Save, Layers, ChevronUp, ChevronDown, Check, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MenuOption {
  id: number;
  nome: string;
  preco: string;
  ativo: boolean;
}

interface LevelOption {
  optionId: number;
  order: number;
}

interface LevelFormData {
  name: string;
  min: string;
  max: string;
  active: boolean;
  isAddon?: boolean;
  options?: LevelOption[];
}

interface LevelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (levelData: LevelFormData) => void;
  onDelete?: () => void;
  editMode?: boolean;
  initialData?: LevelFormData;
  availableOptions?: MenuOption[];
}

export function LevelDialog({
  open,
  onOpenChange,
  onSave,
  onDelete,
  editMode = false,
  initialData,
  availableOptions = []
}: LevelDialogProps) {
  const [levelForm, setLevelForm] = useState<LevelFormData>(initialData || {
    name: "",
    min: "0",
    max: "1",
    active: true,
    isAddon: false,
    options: []
  });

  const [selectedOptions, setSelectedOptions] = useState<LevelOption[]>(
    initialData?.options || []
  );

  const { toast } = useToast();

  // Sync selected options to form data when they change
  useEffect(() => {
    setLevelForm(prev => ({
      ...prev,
      options: selectedOptions
    }));
  }, [selectedOptions]);

  const handleLevelChange = (field: string, value: any) => {
    setLevelForm({
      ...levelForm,
      [field]: value
    });
  };

  const handleSaveLevel = () => {
    // Validate form
    if (!levelForm.name) {
      toast({
        title: "Campo obrigatório",
        description: "Nome do nível é obrigatório",
        variant: "destructive"
      });
      return;
    }
    if (Number(levelForm.min) > Number(levelForm.max)) {
      toast({
        title: "Valores inválidos",
        description: "O mínimo não pode ser maior que o máximo",
        variant: "destructive"
      });
      return;
    }

    // Pass data back to parent
    onSave(levelForm);

    // Reset form if not in edit mode
    if (!editMode) {
      setLevelForm({
        name: "",
        min: "0",
        max: "1",
        active: true,
        isAddon: false,
        options: []
      });
      setSelectedOptions([]);
    }
  };

  const handleAddOption = (optionId: number) => {
    if (selectedOptions.some(o => o.optionId === optionId)) {
      toast({
        description: "Esta opção já foi adicionada a este nível",
      });
      return;
    }

    const maxOrder = selectedOptions.length > 0 
      ? Math.max(...selectedOptions.map(o => o.order))
      : 0;
    
    setSelectedOptions([
      ...selectedOptions,
      { optionId, order: maxOrder + 1 }
    ]);
  };

  const handleRemoveOption = (optionId: number) => {
    setSelectedOptions(selectedOptions.filter(o => o.optionId !== optionId));
  };

  const moveOption = (optionId: number, direction: 'up' | 'down') => {
    const index = selectedOptions.findIndex(o => o.optionId === optionId);
    if (index === -1) return;
    
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === selectedOptions.length - 1)) {
      return;
    }
    
    const newOptions = [...selectedOptions];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap orders
    const tempOrder = newOptions[index].order;
    newOptions[index].order = newOptions[swapIndex].order;
    newOptions[swapIndex].order = tempOrder;
    
    // Swap positions in array to reflect the new order
    [newOptions[index], newOptions[swapIndex]] = [newOptions[swapIndex], newOptions[index]];
    
    setSelectedOptions(newOptions);
  };

  // Get option name by ID
  const getOptionName = (optionId: number) => {
    const option = availableOptions.find(o => o.id === optionId);
    return option ? option.nome : `Opção ${optionId}`;
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
            {editMode ? "Edite os detalhes deste nível do cardápio." : "Crie um novo nível para organizar as opções do seu cardápio."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 gap-3">
            <Label htmlFor="level-name" className="font-medium text-gray-700">
              Nome do nível:
            </Label>
            <Input id="level-name" placeholder="Ex: Proteínas, Tamanhos, Acompanhamentos..." value={levelForm.name} onChange={e => handleLevelChange("name", e.target.value)} />
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <Label className="font-medium text-gray-700">Tipo de nível:</Label>
            
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level-min" className="font-medium text-gray-700 flex items-center">
                Quantidade mínima de opções:
                <span className="ml-2 text-xs text-orange-500">
                  (Padrão: 0 | *Maior que 0: Obrigatório)
                </span>
              </Label>
              <Input id="level-min" type="number" min="0" placeholder="0" value={levelForm.min} onChange={e => handleLevelChange("min", e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="level-max" className="font-medium text-gray-700">
                Quantidade máxima de opções:
                <span className="ml-2 text-xs text-gray-500">
                  (Padrão: 1)
                </span>
              </Label>
              <Input id="level-max" type="number" min="1" placeholder="1" value={levelForm.max} onChange={e => handleLevelChange("max", e.target.value)} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <Label className="font-medium text-gray-700">Ativo?</Label>
            <RadioGroup value={levelForm.active ? "sim" : "nao"} onValueChange={value => handleLevelChange("active", value === "sim")} className="flex space-x-4">
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
          
          {/* New section for selecting options */}
          <div className="grid grid-cols-1 gap-3 border-t pt-4">
            <Label className="font-medium text-gray-700">Opções deste nível:</Label>
            
            {/* Add option selector */}
            <div className="flex gap-2">
              <Select onValueChange={(value) => handleAddOption(Number(value))}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecionar uma opção" />
                </SelectTrigger>
                <SelectContent>
                  {availableOptions.map(option => (
                    <SelectItem 
                      key={option.id} 
                      value={option.id.toString()}
                      disabled={selectedOptions.some(o => o.optionId === option.id)}
                    >
                      {option.nome} {option.preco !== "R$ 0,00" && `(${option.preco})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected options */}
            <div className="border rounded-md mt-2">
              {selectedOptions.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Nenhuma opção adicionada
                </div>
              ) : (
                <ul className="divide-y">
                  {selectedOptions
                    .sort((a, b) => a.order - b.order)
                    .map((option) => (
                      <li key={option.optionId} className="p-3 flex items-center justify-between">
                        <span>{getOptionName(option.optionId)}</span>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={() => moveOption(option.optionId, 'up')}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={() => moveOption(option.optionId, 'down')}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7 text-destructive" 
                            onClick={() => handleRemoveOption(option.optionId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between space-x-4">
          {editMode && onDelete && <Button variant="destructive" onClick={onDelete} className="flex items-center">
              <Trash className="mr-2 h-4 w-4" />
              Excluir Nível
            </Button>}
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-300">
              Cancelar
            </Button>
            <Button onClick={handleSaveLevel} className="bg-fomex-orange hover:bg-fomex-orange/90 flex items-center">
              <Save className="mr-2 h-4 w-4" />
              {editMode ? "Atualizar Nível" : "Criar Nível"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
