
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

interface AddonFormData {
  name: string;
  price: string;
  active: boolean;
}

interface AddonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (addonData: AddonFormData) => void;
}

export function AddonDialog({ open, onOpenChange, onSave }: AddonDialogProps) {
  const [addonForm, setAddonForm] = useState<AddonFormData>({
    name: "",
    price: "",
    active: true,
  });

  const { toast } = useToast();

  const handleAddonChange = (field: string, value: any) => {
    setAddonForm({ ...addonForm, [field]: value });
  };

  const handleSaveAddon = () => {
    // Validate form
    if (!addonForm.name || !addonForm.price) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e preço são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Pass data back to parent
    onSave(addonForm);
    
    // Reset form and close dialog
    setAddonForm({ name: "", price: "", active: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Adicional</DialogTitle>
          <DialogDescription>
            Crie um novo adicional para seus produtos.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="addon-name" className="text-right">
              Nome
            </Label>
            <Input
              id="addon-name"
              placeholder="Nome do adicional"
              value={addonForm.name}
              onChange={(e) => handleAddonChange("name", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="addon-price" className="text-right">
              Preço (R$)
            </Label>
            <Input
              id="addon-price"
              type="text"
              placeholder="0.00"
              value={addonForm.price}
              onChange={(e) => handleAddonChange("price", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="addon-active" className="text-right">
              Ativo
            </Label>
            <div className="col-span-3 flex items-center">
              <Switch
                id="addon-active"
                checked={addonForm.active}
                onCheckedChange={(checked) => handleAddonChange("active", checked)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveAddon}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
