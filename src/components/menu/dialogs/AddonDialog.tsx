
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
import { Trash } from "lucide-react";

interface AddonFormData {
  name: string;
  price: string;
  active: boolean;
}

interface AddonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (addonData: AddonFormData) => void;
  editMode?: boolean;
  initialData?: AddonFormData;
}

export function AddonDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  editMode = false,
  initialData 
}: AddonDialogProps) {
  const [addonForm, setAddonForm] = useState<AddonFormData>(
    initialData || {
      name: "",
      price: "0,00",
      active: true,
    }
  );

  const { toast } = useToast();

  const handleAddonChange = (field: string, value: any) => {
    setAddonForm({ ...addonForm, [field]: value });
  };

  const handleSaveAddon = () => {
    // Validate form
    if (!addonForm.name) {
      toast({
        title: "Campo obrigatório",
        description: "Nome do adicional é obrigatório",
        variant: "destructive",
      });
      return;
    }

    // Pass data back to parent
    onSave(addonForm);
    
    // Reset form if not in edit mode
    if (!editMode) {
      setAddonForm({ name: "", price: "0,00", active: true });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-fomex-orange">
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M2 0H14C15.1 0 16 0.9 16 2V18C16 19.1 15.1 20 14 20H2C0.9 20 0 19.1 0 18V2C0 0.9 0.9 0 2 0ZM2 2V18H14V2H2ZM7 14H9V16H7V14ZM7 4H9V12H7V4Z" fill="#f97316"/>
            </svg>
            {editMode ? "Editar Adicional" : "Adicional"}
          </DialogTitle>
          <DialogDescription>
            {editMode 
              ? "Edite os detalhes deste adicional." 
              : "Crie um novo adicional para seus produtos."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 gap-3">
            <Label htmlFor="addon-name" className="font-medium text-gray-700">
              Nome:
            </Label>
            <Input
              id="addon-name"
              placeholder="Nome do adicional"
              value={addonForm.name}
              onChange={(e) => handleAddonChange("name", e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <Label htmlFor="addon-price" className="font-medium text-gray-700">
              Valor (R$):
            </Label>
            <Input
              id="addon-price"
              placeholder="0,00"
              value={addonForm.price}
              onChange={(e) => handleAddonChange("price", e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <Label className="font-medium text-gray-700">Ativo?</Label>
            <RadioGroup
              value={addonForm.active ? "sim" : "nao"}
              onValueChange={(value) => handleAddonChange("active", value === "sim")}
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
              Excluir Adicional
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
              onClick={handleSaveAddon}
              className="bg-fomex-orange hover:bg-fomex-orange/90"
            >
              {editMode ? "Editar Adicional" : "Salvar"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
