
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { useMenu } from "@/hooks/useMenu";

export function MenuLevelList({ onDelete }: { onDelete: (id: string) => void }) {
  const { levels, isLoading } = useMenu();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setDeletingId(id);
    // Aqui viria a lógica para excluir o nível
    setTimeout(() => {
      onDelete(id.toString());
      setDeletingId(null);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (levels.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-muted-foreground text-center">Nenhum nível encontrado.</p>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Adicione um novo nível para começar.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Opções (min/max)</TableHead>
              <TableHead>Obrigatório</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {levels.map((level) => (
              <TableRow key={level.id}>
                <TableCell className="font-medium">{level.nome}</TableCell>
                <TableCell>
                  {level.qtd_opcoes_min} / {level.qtd_opcoes_max}
                </TableCell>
                <TableCell>{level.obrigatorio ? "Sim" : "Não"}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span
                      className={`inline-block h-2 w-2 rounded-full mr-2 ${
                        level.ativo ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                    {level.ativo ? "Ativo" : "Inativo"}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(level.id)}
                      disabled={deletingId === level.id}
                    >
                      {deletingId === level.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
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
