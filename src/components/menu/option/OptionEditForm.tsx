
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface OptionEditFormProps {
  option: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (option: any) => void;
}

export function OptionEditForm({ option, open, onOpenChange, onSave }: OptionEditFormProps) {
  const [editedOption, setEditedOption] = useState({...option});
  const { toast } = useToast();
  
  const handleChange = (field: string, value: any) => {
    setEditedOption({...editedOption, [field]: value});
  };
  
  const handleSubmit = () => {
    if (!editedOption.nome) {
      toast({ 
        title: "Campo obrigatório",
        description: "Nome da opção é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    onSave(editedOption);
    onOpenChange(false);
  };

  const availableLevels = [
    "Proteína",
    "Tamanho",
    "Ponto da Carne",
    "Acompanhamentos",
    "Molhos",
    "Adicionais"
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Opção</DialogTitle>
          <DialogDescription>
            Edite os detalhes da opção {option.nome}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input 
              id="name" 
              value={editedOption.nome} 
              onChange={(e) => handleChange("nome", e.target.value)}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Preço
            </Label>
            <Input 
              id="price" 
              value={editedOption.preco.replace("R$ ", "")} 
              onChange={(e) => handleChange("preco", `R$ ${e.target.value}`)}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level" className="text-right">
              Nível
            </Label>
            <div className="col-span-3">
              <Select
                value={editedOption.nivel}
                onValueChange={(value) => handleChange("nivel", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  {availableLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="active" className="text-right">
              Ativo
            </Label>
            <div className="col-span-3 flex items-center">
              <Switch 
                id="active" 
                checked={editedOption.ativo} 
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
