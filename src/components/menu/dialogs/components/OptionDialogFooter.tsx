
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Trash } from "lucide-react";

interface OptionDialogFooterProps {
  editMode: boolean;
  onCancel: () => void;
  onSave: () => void;
}

export function OptionDialogFooter({ editMode, onCancel, onSave }: OptionDialogFooterProps) {
  return (
    <DialogFooter className="flex justify-between space-x-4">
      {editMode && (
        <Button 
          variant="destructive" 
          onClick={onCancel}
          className="flex items-center"
        >
          <Trash className="mr-2 h-4 w-4" />
          Excluir Opção de Nível
        </Button>
      )}
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="border-gray-300"
        >
          Cancelar
        </Button>
        <Button 
          onClick={onSave}
          className="bg-fomex-orange hover:bg-fomex-orange/90"
        >
          {editMode ? "Editar Opção de Nível" : "Salvar"}
        </Button>
      </div>
    </DialogFooter>
  );
}
