
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

const menuOptions = [
  { id: 1, nome: "Pequeno", nivel: "Tamanho", precoAdicional: "R$ 0,00", ativo: true },
  { id: 2, nome: "Médio", nivel: "Tamanho", precoAdicional: "R$ 4,00", ativo: true },
  { id: 3, nome: "Grande", nivel: "Tamanho", precoAdicional: "R$ 8,00", ativo: true },
  { id: 4, nome: "Mal passado", nivel: "Ponto da Carne", precoAdicional: "R$ 0,00", ativo: true },
  { id: 5, nome: "Ao ponto", nivel: "Ponto da Carne", precoAdicional: "R$ 0,00", ativo: true },
  { id: 6, nome: "Bem passado", nivel: "Ponto da Carne", precoAdicional: "R$ 0,00", ativo: true },
  { id: 7, nome: "Barbecue", nivel: "Molhos", precoAdicional: "R$ 0,00", ativo: true },
  { id: 8, nome: "Chipotle", nivel: "Molhos", precoAdicional: "R$ 1,50", ativo: true },
];

export function MenuOptionList() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead>Preço Adicional</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuOptions.map((option) => (
              <TableRow key={option.id}>
                <TableCell className="font-medium">{option.nome}</TableCell>
                <TableCell>{option.nivel}</TableCell>
                <TableCell>{option.precoAdicional}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    option.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {option.ativo ? "Ativo" : "Inativo"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
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
