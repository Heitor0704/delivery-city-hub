
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MoveUp, MoveDown } from "lucide-react";

const categories = [
  { id: 1, nome: "Hambúrgueres", descricao: "Hambúrgueres artesanais", ordem: 1, ativo: true },
  { id: 2, nome: "Pizzas", descricao: "Pizzas tradicionais e especiais", ordem: 2, ativo: true },
  { id: 3, nome: "Bebidas", descricao: "Refrigerantes, sucos e bebidas alcoólicas", ordem: 3, ativo: true },
  { id: 4, nome: "Sobremesas", descricao: "Doces e sobremesas", ordem: 4, ativo: false },
  { id: 5, nome: "Acompanhamentos", descricao: "Porções e petiscos", ordem: 5, ativo: true },
];

export function CategoryList() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Ordem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.nome}</TableCell>
                <TableCell>{category.descricao}</TableCell>
                <TableCell>{category.ordem}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    category.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {category.ativo ? "Ativo" : "Inativo"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon">
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-destructive">
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
