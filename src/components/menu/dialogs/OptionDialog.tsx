
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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
}

export function OptionDialog({ open, onOpenChange, onSave }: OptionDialogProps) {
  const [optionForm, setOptionForm] = useState<OptionFormData>({
    name: "",
    price: "",
    level: "",
    active: true,
  });

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
    
    // Reset form and close dialog
    setOptionForm({ name: "", price: "", level: "", active: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Opção</DialogTitle>
          <DialogDescription>
            Crie uma nova opção para seus produtos.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="option-name" className="text-right">
              Nome
            </Label>
            <Input
              id="option-name"
              placeholder="Nome da opção"
              value={optionForm.name}
              onChange={(e) => handleOptionChange("name", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="option-price" className="text-right">
              Preço adicional (R$)
            </Label>
            <Input
              id="option-price"
              type="text"
              placeholder="0.00"
              value={optionForm.price}
              onChange={(e) => handleOptionChange("price", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="option-level" className="text-right">
              Nível
            </Label>
            <div className="col-span-3">
              <Select
                value={optionForm.level}
                onValueChange={(value) => handleOptionChange("level", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Proteína">Proteína</SelectItem>
                  <SelectItem value="Tamanho">Tamanho</SelectItem>
                  <SelectItem value="Ponto da Carne">Ponto da Carne</SelectItem>
                  <SelectItem value="Acompanhamentos">Acompanhamentos</SelectItem>
                  <SelectItem value="Molhos">Molhos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="option-active" className="text-right">
              Ativo
            </Label>
            <div className="col-span-3 flex items-center">
              <Switch
                id="option-active"
                checked={optionForm.active}
                onCheckedChange={(checked) => handleOptionChange("active", checked)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveOption}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
