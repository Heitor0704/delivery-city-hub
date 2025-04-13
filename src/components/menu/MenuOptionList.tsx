
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
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

const initialOptions = [
  { id: 1, nome: "Picanha", preco: "R$ 5,00", nivel: "Proteína", ativo: true },
  { id: 2, nome: "Filé Mignon", preco: "R$ 7,00", nivel: "Proteína", ativo: true },
  { id: 3, nome: "Pequeno", preco: "R$ 0,00", nivel: "Tamanho", ativo: true },
  { id: 4, nome: "Médio", preco: "R$ 3,00", nivel: "Tamanho", ativo: true },
  { id: 5, nome: "Grande", preco: "R$ 5,00", nivel: "Tamanho", ativo: false },
];

const availableLevels = [
  "Proteína",
  "Tamanho",
  "Ponto da Carne",
  "Acompanhamentos",
  "Molhos"
];

interface OptionEditFormProps {
  option: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (option: any) => void;
}

function OptionEditForm({ option, open, onOpenChange, onSave }: OptionEditFormProps) {
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

interface MenuOptionListProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function MenuOptionList({ onEdit, onDelete }: MenuOptionListProps) {
  const [options, setOptions] = useState(initialOptions);
  const [editingOption, setEditingOption] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleEdit = (id: string | number) => {
    const option = options.find(item => item.id.toString() === id.toString());
    if (option) {
      setEditingOption(option);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleSaveEdit = (updatedOption: any) => {
    const updatedOptions = options.map(item => 
      item.id === updatedOption.id ? updatedOption : item
    );
    setOptions(updatedOptions);
    
    toast({
      title: "Opção atualizada",
      description: `A opção '${updatedOption.nome}' foi atualizada com sucesso.`
    });
  };

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {options.map((option) => (
                <TableRow key={option.id}>
                  <TableCell className="font-medium">{option.nome}</TableCell>
                  <TableCell>{option.preco}</TableCell>
                  <TableCell>{option.nivel}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      option.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {option.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEdit(option.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => onDelete && onDelete(option.id.toString())}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {editingOption && (
        <OptionEditForm 
          option={editingOption} 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
}
