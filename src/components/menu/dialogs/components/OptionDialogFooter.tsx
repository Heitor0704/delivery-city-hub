
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Trash, Save } from "lucide-react";

interface OptionDialogFooterProps {
  editMode: boolean;
  onCancel: () => void;
  onSave: () => void;
  onDelete?: () => void;
}

export function OptionDialogFooter({ editMode, onCancel, onSave, onDelete }: OptionDialogFooterProps) {
  return (
    <DialogFooter className="flex justify-between space-x-4">
      {editMode && onDelete && (
        <Button 
          variant="destructive" 
          onClick={onDelete}
          className="flex items-center"
        >
          <Trash className="mr-2 h-4 w-4" />
          Excluir Opção
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
          className="bg-fomex-orange hover:bg-fomex-orange/90 flex items-center"
        >
          <Save className="mr-2 h-4 w-4" />
          {editMode ? "Atualizar Opção" : "Criar Opção"}
        </Button>
      </div>
    </DialogFooter>
  );
}
