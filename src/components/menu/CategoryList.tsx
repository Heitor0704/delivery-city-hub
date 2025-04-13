
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

const categories = [
  { id: 1, nome: "Hambúrgueres", descricao: "Hambúrgueres artesanais", imagem: "burger.jpg", ativo: true },
  { id: 2, nome: "Pizzas", descricao: "Pizzas tradicionais e premium", imagem: "pizza.jpg", ativo: true },
  { id: 3, nome: "Bebidas", descricao: "Refrigerantes, sucos e bebidas alcoólicas", imagem: "drinks.jpg", ativo: true },
  { id: 4, nome: "Sobremesas", descricao: "Doces e sobremesas", imagem: "dessert.jpg", ativo: true },
  { id: 5, nome: "Combos", descricao: "Combos promocionais", imagem: "combo.jpg", ativo: false },
];

interface CategoryListProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function CategoryList({ onEdit, onDelete }: CategoryListProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
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
                      onClick={() => onEdit && onEdit(category.id.toString())}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-destructive"
                      onClick={() => onDelete && onDelete(category.id.toString())}
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
