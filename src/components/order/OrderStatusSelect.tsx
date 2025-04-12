
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

const statusColors: Record<string, string> = {
  aguardando: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  preparando: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  entregando: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  entregue: "bg-green-100 text-green-800 hover:bg-green-100",
  cancelado: "bg-red-100 text-red-800 hover:bg-red-100",
};

const statusLabels: Record<string, string> = {
  aguardando: "Aguardando",
  preparando: "Preparando",
  entregando: "Entregando",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export function OrderStatusSelect({ orderId, currentStatus, onStatusChange }: OrderStatusSelectProps) {
  return (
    <Select
      defaultValue={currentStatus}
      onValueChange={onStatusChange}
    >
      <SelectTrigger className="w-[130px] border-none p-0">
        <SelectValue>
          <Badge variant="outline" className={statusColors[currentStatus]}>
            {statusLabels[currentStatus]}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="aguardando">
          <Badge variant="outline" className={statusColors.aguardando}>
            Aguardando
          </Badge>
        </SelectItem>
        <SelectItem value="preparando">
          <Badge variant="outline" className={statusColors.preparando}>
            Preparando
          </Badge>
        </SelectItem>
        <SelectItem value="entregando">
          <Badge variant="outline" className={statusColors.entregando}>
            Entregando
          </Badge>
        </SelectItem>
        <SelectItem value="entregue">
          <Badge variant="outline" className={statusColors.entregue}>
            Entregue
          </Badge>
        </SelectItem>
        <SelectItem value="cancelado">
          <Badge variant="outline" className={statusColors.cancelado}>
            Cancelado
          </Badge>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
