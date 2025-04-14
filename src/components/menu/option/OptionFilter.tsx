
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OptionFilterProps {
  selectedLevel: string;
  setSelectedLevel: (value: string) => void;
  availableLevels: string[];
}

export function OptionFilter({ selectedLevel, setSelectedLevel, availableLevels }: OptionFilterProps) {
  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between">
      <Select
        value={selectedLevel}
        onValueChange={setSelectedLevel}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Filtrar por nível" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os níveis</SelectItem>
          {availableLevels.map(level => (
            <SelectItem key={level} value={level}>{level}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
