
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Utensils } from "lucide-react";

interface OptionDialogHeaderProps {
  editMode: boolean;
}

export function OptionDialogHeader({ editMode }: OptionDialogHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center text-fomex-orange">
        <Utensils className="mr-2 h-5 w-5" />
        {editMode ? "Editar Opção" : "Nova Opção de Menu"}
      </DialogTitle>
      <DialogDescription>
        {editMode 
          ? "Edite os detalhes desta opção do cardápio." 
          : "Crie uma nova opção para um nível específico do seu cardápio."}
      </DialogDescription>
    </DialogHeader>
  );
}
