
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OptionFormData {
  name: string;
  price: string;
  level: string;
  active: boolean;
}

interface OptionFormProps {
  formData: OptionFormData;
  onChange: (field: string, value: any) => void;
  menuLevels: { id: string; name: string }[];
}

export function OptionForm({ formData, onChange, menuLevels }: OptionFormProps) {
  return (
    <div className="grid gap-6 py-4">
      <div className="grid grid-cols-1 gap-3">
        <Label htmlFor="option-name" className="font-medium text-gray-700">
          Nome:
        </Label>
        <Input
          id="option-name"
          placeholder="Nome da opção"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        <Label htmlFor="option-level" className="font-medium text-gray-700">
          Nível de Cardápio:
        </Label>
        <Select
          value={formData.level}
          onValueChange={(value) => onChange("level", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Escolha um nível" />
          </SelectTrigger>
          <SelectContent>
            {menuLevels.map((level) => (
              <SelectItem key={level.id} value={level.name}>{level.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        <Label htmlFor="option-price" className="font-medium text-gray-700">
          Valor (R$)
        </Label>
        <Input
          id="option-price"
          type="text"
          placeholder="0,00"
          value={formData.price}
          onChange={(e) => onChange("price", e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        <Label className="font-medium text-gray-700">Ativo?</Label>
        <RadioGroup
          value={formData.active ? "sim" : "nao"}
          onValueChange={(value) => onChange("active", value === "sim")}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sim" id="active-yes" />
            <Label htmlFor="active-yes">Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="nao" id="active-no" />
            <Label htmlFor="active-no">Não</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
