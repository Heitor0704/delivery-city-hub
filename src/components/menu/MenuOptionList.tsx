
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMenu } from "@/hooks/useMenu";
import { formatCurrency } from "@/lib/formatters";

export function MenuOptionList({ onDelete }: { onDelete: (id: string) => void }) {
  const { levels, options, isLoading } = useMenu();
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setDeletingId(id);
    // Aqui viria a lógica para excluir a opção
    setTimeout(() => {
      onDelete(id.toString());
      setDeletingId(null);
    }, 500);
  };

  const currentLevelOptions = selectedLevel 
    ? options[parseInt(selectedLevel)] || [] 
    : [];

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
            Adicione um nível primeiro para depois criar opções.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Select
          value={selectedLevel}
          onValueChange={setSelectedLevel}
        >
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Selecione um nível" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((level) => (
              <SelectItem key={level.id} value={level.id.toString()}>
                {level.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedLevel ? (
        currentLevelOptions.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentLevelOptions.map((option) => (
                    <TableRow key={option.id}>
                      <TableCell className="font-medium">{option.nome}</TableCell>
                      <TableCell>{option.valor > 0 ? formatCurrency(option.valor) : "Grátis"}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span
                            className={`inline-block h-2 w-2 rounded-full mr-2 ${
                              option.ativo ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                          {option.ativo ? "Ativo" : "Inativo"}
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
                            onClick={() => handleDelete(option.id)}
                            disabled={deletingId === option.id}
                          >
                            {deletingId === option.id ? (
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
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-center">Nenhuma opção encontrada para este nível.</p>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Adicione uma nova opção para começar.
              </p>
            </CardContent>
          </Card>
        )
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-center">Selecione um nível para ver suas opções.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
