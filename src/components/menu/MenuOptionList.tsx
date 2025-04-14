import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { OptionEditForm } from "./option/OptionEditForm";
import { OptionTable } from "./option/OptionTable";
import { OptionFilter } from "./option/OptionFilter";
import { groupAndSortOptionsByLevel } from "./option/utils";

const initialOptions = [
  { id: 1, nome: "Picanha", preco: "R$ 5,00", nivel: "Proteína", ativo: true, ordem: 1 },
  { id: 2, nome: "Filé Mignon", preco: "R$ 7,00", nivel: "Proteína", ativo: true, ordem: 2 },
  { id: 3, nome: "Pequeno", preco: "R$ 0,00", nivel: "Tamanho", ativo: true, ordem: 1 },
  { id: 4, nome: "Médio", preco: "R$ 3,00", nivel: "Tamanho", ativo: true, ordem: 2 },
  { id: 5, nome: "Grande", preco: "R$ 5,00", nivel: "Tamanho", ativo: false, ordem: 3 },
  { id: 6, nome: "Batata Frita", preco: "R$ 8,00", nivel: "Adicionais", ativo: true, ordem: 1 },
  { id: 7, nome: "Bacon Extra", preco: "R$ 4,00", nivel: "Adicionais", ativo: true, ordem: 2 },
];

const availableLevels = [
  "Proteína",
  "Tamanho",
  "Ponto da Carne",
  "Acompanhamentos",
  "Molhos",
  "Adicionais"
];

interface MenuOptionListProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSaveOption?: (option: any) => void;
}

export function MenuOptionList({ onEdit, onDelete, onSaveOption }: MenuOptionListProps) {
  const [options, setOptions] = useState(initialOptions);
  const [editingOption, setEditingOption] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const { toast } = useToast();
  
  const handleEdit = (id: string | number) => {
    const option = options.find(item => item.id.toString() === id.toString());
    if (option) {
      setEditingOption(option);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleSaveEdit = (updatedOption: any) => {
    const updatedOptions = options.map(item => 
      item.id === updatedOption.id ? updatedOption : item
    );
    setOptions(updatedOptions);
    
    if (onSaveOption) {
      onSaveOption(updatedOption);
    }
    
    toast({
      title: "Opção atualizada",
      description: `A opção '${updatedOption.nome}' foi atualizada com sucesso.`
    });
  };

  const moveItem = (id: number | string, direction: 'up' | 'down') => {
    const optionToMove = options.find(option => option.id === id);
    if (!optionToMove) return;
    
    const sameTypeOptions = options.filter(option => option.nivel === optionToMove.nivel)
      .sort((a, b) => a.ordem - b.ordem);
      
    const index = sameTypeOptions.findIndex(option => option.id === id);
    
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === sameTypeOptions.length - 1)) {
      return;
    }
    
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const tempOrdem = sameTypeOptions[index].ordem;
    sameTypeOptions[index].ordem = sameTypeOptions[swapIndex].ordem;
    sameTypeOptions[swapIndex].ordem = tempOrdem;
    
    const updatedOptions = options.map(option => {
      const updatedOption = sameTypeOptions.find(o => o.id === option.id);
      return updatedOption || option;
    });
    
    setOptions(updatedOptions);
    
    toast({
      title: "Ordem atualizada",
      description: "A ordem das opções foi atualizada com sucesso."
    });
  };

  const duplicateOption = (id: number | string) => {
    const optionToDuplicate = options.find(option => option.id === id);
    if (!optionToDuplicate) return;
    
    const maxId = Math.max(...options.map(o => Number(o.id)));
    
    const sameTypeOptions = options.filter(o => o.nivel === optionToDuplicate.nivel);
    const maxOrder = Math.max(...sameTypeOptions.map(o => Number(o.ordem)));
    
    const newOption = {
      ...optionToDuplicate,
      id: maxId + 1,
      nome: `${optionToDuplicate.nome} (cópia)`,
      ordem: maxOrder + 1
    };
    
    setOptions([...options, newOption]);
    
    toast({
      title: "Opção duplicada",
      description: `A opção '${optionToDuplicate.nome}' foi duplicada com sucesso.`
    });
  };

  const sortedOptions = groupAndSortOptionsByLevel(options, selectedLevel);

  return (
    <>
      <OptionFilter 
        selectedLevel={selectedLevel} 
        setSelectedLevel={setSelectedLevel}
        availableLevels={availableLevels}
      />
      
      <OptionTable 
        options={sortedOptions}
        onEdit={handleEdit}
        onDelete={onDelete}
        moveItem={moveItem}
        duplicateOption={duplicateOption}
      />
      
      {editingOption && (
        <OptionEditForm 
          option={editingOption} 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
}
