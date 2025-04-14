
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Category } from "./types";

interface CategoryItemProps {
  category: Category;
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

export function CategoryItem({ category, onEdit, onDelete }: CategoryItemProps) {
  return (
    <TableRow key={category.id}>
      <TableCell className="font-medium">{category.nome}</TableCell>
      <TableCell>{category.descricao}</TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded-full text-xs ${
          category.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {category.ativo ? "Ativo" : "Inativo"}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onEdit(category.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="text-destructive"
            onClick={() => onDelete(category.id.toString())}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
