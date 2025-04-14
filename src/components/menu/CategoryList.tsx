
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CategoryTable } from "./category/CategoryTable";
import { CategoryEditForm } from "./category/CategoryEditForm";
import { initialCategories, Category } from "./category/types";

interface CategoryListProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function CategoryList({ onEdit, onDelete }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleEdit = (id: string | number) => {
    const category = categories.find(cat => cat.id.toString() === id.toString());
    if (category) {
      setEditingCategory(category);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleSaveEdit = (updatedCategory: Category) => {
    const updatedCategories = categories.map(cat => 
      cat.id === updatedCategory.id ? updatedCategory : cat
    );
    setCategories(updatedCategories);
    
    toast({
      title: "Categoria atualizada",
      description: `A categoria '${updatedCategory.nome}' foi atualizada com sucesso.`
    });
  };

  const handleDelete = (id: string | number) => {
    if (onDelete) {
      onDelete(id.toString());
    }
  };

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <CategoryTable 
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
      
      {editingCategory && (
        <CategoryEditForm 
          category={editingCategory} 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
}
