
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface OptionDialogHeaderProps {
  editMode: boolean;
}

export function OptionDialogHeader({ editMode }: OptionDialogHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center text-fomex-orange">
        <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
          <path d="M2 0H14C15.1 0 16 0.9 16 2V18C16 19.1 15.1 20 14 20H2C0.9 20 0 19.1 0 18V2C0 0.9 0.9 0 2 0ZM2 2V18H14V2H2ZM7 14H9V16H7V14ZM7 4H9V12H7V4Z" fill="#f97316"/>
        </svg>
        {editMode ? "Editar Opção" : "Opções de Nível de Cardápio"}
      </DialogTitle>
      <DialogDescription>
        {editMode 
          ? "Edite os detalhes desta opção do cardápio." 
          : "Crie uma nova opção para seus produtos."}
      </DialogDescription>
    </DialogHeader>
  );
}
