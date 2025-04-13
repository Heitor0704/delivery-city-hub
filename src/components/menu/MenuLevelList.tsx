
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

const levels = [
  { id: 1, nome: "Proteína", minimo: 1, maximo: 1, ativo: true },
  { id: 2, nome: "Tamanho", minimo: 1, maximo: 1, ativo: true },
  { id: 3, nome: "Ponto da Carne", minimo: 0, maximo: 1, ativo: true },
  { id: 4, nome: "Acompanhamentos", minimo: 0, maximo: 3, ativo: true },
  { id: 5, nome: "Molhos", minimo: 0, maximo: 2, ativo: false },
];

interface MenuLevelListProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function MenuLevelList({ onEdit, onDelete }: MenuLevelListProps) {
  return (
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
                      onClick={() => onEdit && onEdit(level.id.toString())}
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
  );
}
