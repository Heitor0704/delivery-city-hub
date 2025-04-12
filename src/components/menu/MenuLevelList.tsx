
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";

const menuLevels = [
  { 
    id: 1, 
    nome: "Tamanho", 
    obrigatorio: true, 
    minSelecoes: 1, 
    maxSelecoes: 1, 
    ativo: true,
    opcoes: ["Pequeno", "Médio", "Grande"]
  },
  { 
    id: 2, 
    nome: "Ponto da Carne", 
    obrigatorio: true, 
    minSelecoes: 1, 
    maxSelecoes: 1, 
    ativo: true,
    opcoes: ["Mal passado", "Ao ponto", "Bem passado"]
  },
  { 
    id: 3, 
    nome: "Molhos", 
    obrigatorio: false, 
    minSelecoes: 0, 
    maxSelecoes: 3, 
    ativo: true,
    opcoes: ["Barbecue", "Mostarda e Mel", "Maionese", "Chipotle", "Ranch"]
  },
];

export function MenuLevelList() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Obrigatório</TableHead>
              <TableHead>Seleções</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuLevels.map((level) => (
              <TableRow key={level.id}>
                <TableCell className="font-medium">{level.nome}</TableCell>
                <TableCell>
                  {level.obrigatorio ? (
                    <span className="text-green-600">Sim</span>
                  ) : (
                    <span className="text-gray-500">Não</span>
                  )}
                </TableCell>
                <TableCell>
                  {level.minSelecoes === level.maxSelecoes 
                    ? `Exatamente ${level.minSelecoes}`
                    : `${level.minSelecoes} a ${level.maxSelecoes}`}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    level.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {level.ativo ? "Ativo" : "Inativo"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
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
