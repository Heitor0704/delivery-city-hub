
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ArrowUp, ArrowDown, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { LevelDialog } from "./dialogs/LevelDialog";

const initialLevels = [{
  id: 1,
  nome: "Proteína",
  minimo: 1,
  maximo: 1,
  ativo: true,
  ordem: 1,
  options: [{ optionId: 1, order: 1 }, { optionId: 2, order: 2 }]
}, {
  id: 2,
  nome: "Tamanho",
  minimo: 1,
  maximo: 1,
  ativo: true,
  ordem: 2,
  options: [{ optionId: 3, order: 1 }, { optionId: 4, order: 2 }, { optionId: 5, order: 3 }]
}, {
  id: 3,
  nome: "Ponto da Carne",
  minimo: 0,
  maximo: 1,
  ativo: true,
  ordem: 3,
  options: []
}, {
  id: 4,
  nome: "Acompanhamentos",
  minimo: 0,
  maximo: 3,
  ativo: true,
  ordem: 4,
  options: []
}, {
  id: 5,
  nome: "Molhos",
  minimo: 0,
  maximo: 2,
  ativo: false,
  ordem: 5,
  options: []
}, {
  id: 6,
  nome: "Adicionais",
  minimo: 0,
  maximo: 10,
  ativo: true,
  ordem: 6,
  options: [{ optionId: 6, order: 1 }, { optionId: 7, order: 2 }]
}];

// Sample menu options for demonstration
const menuOptions = [
  { id: 1, nome: "Picanha", preco: "R$ 5,00", nivel: "Proteína", ativo: true },
  { id: 2, nome: "Filé Mignon", preco: "R$ 7,00", nivel: "Proteína", ativo: true },
  { id: 3, nome: "Pequeno", preco: "R$ 0,00", nivel: "Tamanho", ativo: true },
  { id: 4, nome: "Médio", preco: "R$ 3,00", nivel: "Tamanho", ativo: true },
  { id: 5, nome: "Grande", preco: "R$ 5,00", nivel: "Tamanho", ativo: false },
  { id: 6, nome: "Batata Frita", preco: "R$ 8,00", nivel: "Adicionais", ativo: true },
  { id: 7, nome: "Bacon Extra", preco: "R$ 4,00", nivel: "Adicionais", ativo: true },
];

interface MenuLevelListProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function MenuLevelList({
  onEdit,
  onDelete
}: MenuLevelListProps) {
  const [levels, setLevels] = useState(initialLevels);
  const [editingLevel, setEditingLevel] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const {
    toast
  } = useToast();

  const handleEdit = (id: string | number) => {
    const level = levels.find(item => item.id.toString() === id.toString());
    if (level) {
      // Transform level to LevelFormData format
      const levelFormData = {
        name: level.nome,
        min: level.minimo.toString(),
        max: level.maximo.toString(),
        active: level.ativo,
        options: level.options || []
      };
      
      setEditingLevel({
        ...level,
        formData: levelFormData
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveEdit = (updatedLevelForm: any) => {
    const updatedLevel = {
      ...editingLevel,
      nome: updatedLevelForm.name,
      minimo: parseInt(updatedLevelForm.min, 10),
      maximo: parseInt(updatedLevelForm.max, 10),
      ativo: updatedLevelForm.active,
      options: updatedLevelForm.options || []
    };
    
    const updatedLevels = levels.map(item => 
      item.id === updatedLevel.id ? updatedLevel : item
    );
    
    setLevels(updatedLevels);
    
    toast({
      title: "Nível atualizado",
      description: `O nível '${updatedLevel.nome}' foi atualizado com sucesso.`
    });
    
    setIsEditDialogOpen(false);
  };

  const moveItem = (id: number | string, direction: 'up' | 'down') => {
    const index = levels.findIndex(level => level.id === id);
    if (direction === 'up' && index === 0 || direction === 'down' && index === levels.length - 1) {
      return;
    }
    const newLevels = [...levels];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap ordem values between the two items
    const tempOrdem = newLevels[index].ordem;
    newLevels[index].ordem = newLevels[swapIndex].ordem;
    newLevels[swapIndex].ordem = tempOrdem;

    // Swap positions in array
    [newLevels[index], newLevels[swapIndex]] = [newLevels[swapIndex], newLevels[index]];
    setLevels(newLevels);
    toast({
      title: "Ordem atualizada",
      description: "A ordem dos níveis foi atualizada com sucesso."
    });
  };

  const duplicateLevel = (id: number | string) => {
    const levelToDuplicate = levels.find(level => level.id === id);
    if (!levelToDuplicate) return;
    const maxId = Math.max(...levels.map(l => Number(l.id)));
    const maxOrder = Math.max(...levels.map(l => Number(l.ordem)));
    const newLevel = {
      ...levelToDuplicate,
      id: maxId + 1,
      nome: `${levelToDuplicate.nome} (cópia)`,
      ordem: maxOrder + 1
    };
    setLevels([...levels, newLevel]);
    toast({
      title: "Nível duplicado",
      description: `O nível '${levelToDuplicate.nome}' foi duplicado com sucesso.`
    });
  };

  // Sort levels by order before rendering
  const sortedLevels = [...levels].sort((a, b) => a.ordem - b.ordem);
  
  // Get option count for each level
  const getOptionCount = (level: any) => {
    return level.options ? level.options.length : 0;
  };
  
  return <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Mínimo</TableHead>
                <TableHead>Máximo</TableHead>
                <TableHead>Opções</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLevels.map(level => <TableRow key={level.id}>
                  <TableCell className="font-medium">{level.nome}</TableCell>
                  <TableCell>{level.minimo}</TableCell>
                  <TableCell>{level.maximo}</TableCell>
                  <TableCell>{getOptionCount(level)}</TableCell>
                  <TableCell>{level.ordem}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${level.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {level.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => moveItem(level.id, 'up')}
                        disabled={sortedLevels.indexOf(level) === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => moveItem(level.id, 'down')}
                        disabled={sortedLevels.indexOf(level) === sortedLevels.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      
                      <Button variant="outline" size="icon" onClick={() => duplicateLevel(level.id)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleEdit(level.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="text-destructive" onClick={() => onDelete && onDelete(level.id.toString())}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Use LevelDialog instead of inline edit form */}
      {editingLevel && (
        <LevelDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveEdit}
          onDelete={() => onDelete && onDelete(editingLevel.id.toString())}
          editMode={true}
          initialData={editingLevel.formData}
          availableOptions={menuOptions}
        />
      )}
    </>;
}
