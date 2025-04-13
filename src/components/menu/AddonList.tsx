
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

const initialAddons = [
  { id: 1, nome: "Queijo Extra", preco: "R$ 3,50", ativo: true },
  { id: 2, nome: "Bacon", preco: "R$ 4,00", ativo: true },
  { id: 3, nome: "Cheddar", preco: "R$ 3,00", ativo: true },
  { id: 4, nome: "Catupiry", preco: "R$ 3,50", ativo: true },
  { id: 5, nome: "Ovo", preco: "R$ 2,50", ativo: false },
];

interface AddonEditFormProps {
  addon: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (addon: any) => void;
}

function AddonEditForm({ addon, open, onOpenChange, onSave }: AddonEditFormProps) {
  const [editedAddon, setEditedAddon] = useState({...addon});
  const { toast } = useToast();
  
  const handleChange = (field: string, value: any) => {
    setEditedAddon({...editedAddon, [field]: value});
  };
  
  const handleSubmit = () => {
    if (!editedAddon.nome) {
      toast({
        title: "Campo obrigatório",
        description: "Nome do adicional é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    onSave(editedAddon);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Adicional</DialogTitle>
          <DialogDescription>
            Edite os detalhes do adicional {addon.nome}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input 
              id="name" 
              value={editedAddon.nome} 
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
              value={editedAddon.preco.replace("R$ ", "")} 
              onChange={(e) => handleChange("preco", `R$ ${e.target.value}`)}
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
                checked={editedAddon.ativo} 
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

interface AddonListProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function AddonList({ onEdit, onDelete }: AddonListProps) {
  const [addons, setAddons] = useState(initialAddons);
  const [editingAddon, setEditingAddon] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleEdit = (id: string | number) => {
    const addon = addons.find(item => item.id.toString() === id.toString());
    if (addon) {
      setEditingAddon(addon);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleSaveEdit = (updatedAddon: any) => {
    const updatedAddons = addons.map(item => 
      item.id === updatedAddon.id ? updatedAddon : item
    );
    setAddons(updatedAddons);
    
    toast({
      title: "Adicional atualizado",
      description: `O adicional '${updatedAddon.nome}' foi atualizado com sucesso.`
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addons.map((addon) => (
                <TableRow key={addon.id}>
                  <TableCell className="font-medium">{addon.nome}</TableCell>
                  <TableCell>{addon.preco}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      addon.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {addon.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEdit(addon.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => onDelete && onDelete(addon.id.toString())}
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
      
      {editingAddon && (
        <AddonEditForm 
          addon={editingAddon} 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
}
