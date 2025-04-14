
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Trash2, ArrowUp, ArrowDown, Copy } from "lucide-react";

interface OptionItemProps {
  option: {
    id: number;
    nome: string;
    preco: string;
    nivel: string;
    ativo: boolean;
    ordem: number;
  };
  onEdit: (id: number | string) => void;
  onDelete?: (id: string) => void;
  moveItem: (id: number | string, direction: 'up' | 'down') => void;
  duplicateOption: (id: number | string) => void;
}

export function OptionItem({ option, onEdit, onDelete, moveItem, duplicateOption }: OptionItemProps) {
  return (
    <TableRow key={option.id}>
      <TableCell className="font-medium">{option.nome}</TableCell>
      <TableCell>{option.preco}</TableCell>
      <TableCell>{option.nivel}</TableCell>
      <TableCell>{option.ordem}</TableCell>
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
            onClick={() => moveItem(option.id, 'up')}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => moveItem(option.id, 'down')}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => duplicateOption(option.id)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onEdit(option.id)}
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
  );
}
