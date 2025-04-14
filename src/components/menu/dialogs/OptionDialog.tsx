
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { OptionForm } from "./components/OptionForm";
import { OptionDialogHeader } from "./components/OptionDialogHeader";
import { OptionDialogFooter } from "./components/OptionDialogFooter";

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
        <OptionDialogHeader editMode={editMode} />
        
        <OptionForm 
          formData={optionForm}
          onChange={handleOptionChange}
          menuLevels={menuLevels}
        />
        
        <OptionDialogFooter
          editMode={editMode}
          onCancel={() => onOpenChange(false)}
          onSave={handleSaveOption}
        />
      </DialogContent>
    </Dialog>
  );
}
