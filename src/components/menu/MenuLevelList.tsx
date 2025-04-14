
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
import { useToast } from "@/hooks/use-toast";

const initialLevels = [
  { id: 1, nome: "Proteína", minimo: 1, maximo: 1, ativo: true },
  { id: 2, nome: "Tamanho", minimo: 1, maximo: 1, ativo: true },
  { id: 3, nome: "Ponto da Carne", minimo: 0, maximo: 1, ativo: true },
  { id: 4, nome: "Acompanhamentos", minimo: 0, maximo: 3, ativo: true },
  { id: 5, nome: "Molhos", minimo: 0, maximo: 2, ativo: false },
];

interface LevelEditFormProps {
  level: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (level: any) => void;
}

function LevelEditForm({ level, open, onOpenChange, onSave }: LevelEditFormProps) {
  const [editedLevel, setEditedLevel] = useState({...level});
  const { toast } = useToast();
  
  const handleChange = (field: string, value: any) => {
    setEditedLevel({...editedLevel, [field]: value});
  };
  
  const handleSubmit = () => {
    if (!editedLevel.nome) {
      toast({
        title: "Campo obrigatório",
        description: "Nome do nível é obrigatório",
        variant: "destructive"
      });
      return;
    }

    if (editedLevel.minimo > editedLevel.maximo) {
      toast({
        title: "Valores inválidos",
        description: "O valor mínimo não pode ser maior que o máximo",
        variant: "destructive"
      });
      return;
    }
    
    onSave(editedLevel);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Nível</DialogTitle>
          <DialogDescription>
            Edite os detalhes do nível {level.nome}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input 
              id="name" 
              value={editedLevel.nome} 
              onChange={(e) => handleChange("nome", e.target.value)}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="min" className="text-right">
              Mínimo
            </Label>
            <Input 
              id="min" 
              type="number" 
              min="0"
              value={editedLevel.minimo} 
              onChange={(e) => handleChange("minimo", parseInt(e.target.value, 10) || 0)}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="max" className="text-right">
              Máximo
            </Label>
            <Input 
              id="max" 
              type="number"
              min="0" 
              value={editedLevel.maximo} 
              onChange={(e) => handleChange("maximo", parseInt(e.target.value, 10) || 1)}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="active" className="text-right">
              Ativo
            </Label>
            <div className="col-span-3 flex items-center">
              <Switch 
                id="active" 
                checked={editedLevel.ativo} 
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

interface MenuLevelListProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function MenuLevelList({ onEdit, onDelete }: MenuLevelListProps) {
  const [levels, setLevels] = useState(initialLevels);
  const [editingLevel, setEditingLevel] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleEdit = (id: string | number) => {
    const level = levels.find(item => item.id.toString() === id.toString());
    if (level) {
      setEditingLevel(level);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleSaveEdit = (updatedLevel: any) => {
    const updatedLevels = levels.map(item => 
      item.id === updatedLevel.id ? updatedLevel : item
    );
    setLevels(updatedLevels);
    
    toast({
      title: "Nível atualizado",
      description: `O nível '${updatedLevel.nome}' foi atualizado com sucesso.`
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
                <TableHead>Mínimo</TableHead>
                <TableHead>Máximo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {levels.map((level) => (
                <TableRow key={level.id}>
                  <TableCell className="font-medium">{level.nome}</TableCell>
                  <TableCell>{level.minimo}</TableCell>
                  <TableCell>{level.maximo}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      level.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {level.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEdit(level.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => onDelete && onDelete(level.id.toString())}
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
      
      {editingLevel && (
        <LevelEditForm 
          level={editingLevel} 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
}
