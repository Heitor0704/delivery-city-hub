
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

const options = [
  { id: 1, nome: "Picanha", preco: "R$ 5,00", nivel: "Proteína", ativo: true },
  { id: 2, nome: "Filé Mignon", preco: "R$ 7,00", nivel: "Proteína", ativo: true },
  { id: 3, nome: "Pequeno", preco: "R$ 0,00", nivel: "Tamanho", ativo: true },
  { id: 4, nome: "Médio", preco: "R$ 3,00", nivel: "Tamanho", ativo: true },
  { id: 5, nome: "Grande", preco: "R$ 5,00", nivel: "Tamanho", ativo: false },
];

interface MenuOptionListProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function MenuOptionList({ onEdit, onDelete }: MenuOptionListProps) {
  return (
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
                      onClick={() => onEdit && onEdit(option.id.toString())}
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
  );
}
