
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

const addons = [
  { id: 1, nome: "Queijo Extra", preco: "R$ 3,50", ativo: true },
  { id: 2, nome: "Bacon", preco: "R$ 4,00", ativo: true },
  { id: 3, nome: "Cheddar", preco: "R$ 3,00", ativo: true },
  { id: 4, nome: "Catupiry", preco: "R$ 3,50", ativo: true },
  { id: 5, nome: "Ovo", preco: "R$ 2,50", ativo: false },
];

interface AddonListProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function AddonList({ onEdit, onDelete }: AddonListProps) {
  return (
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
                      onClick={() => onEdit && onEdit(addon.id.toString())}
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
  );
}
