
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OptionItem } from "./OptionItem";

interface OptionTableProps {
  options: any[];
  onEdit: (id: number | string) => void;
  onDelete?: (id: string) => void;
  moveItem: (id: number | string, direction: 'up' | 'down') => void;
  duplicateOption: (id: number | string) => void;
}

export function OptionTable({ options, onEdit, onDelete, moveItem, duplicateOption }: OptionTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead>Ordem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {options.map((option) => (
              <OptionItem
                key={option.id}
                option={option}
                onEdit={onEdit}
                onDelete={onDelete}
                moveItem={moveItem}
                duplicateOption={duplicateOption}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
