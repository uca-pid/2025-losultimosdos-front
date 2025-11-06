import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface UserSedeSelectorProps {
  currentValue: {
    id: number;
    name: string;
  };
  options: {
    id: number;
    name: string;
  }[];
  isUpdating: boolean;
  onValueChange: (value: { id: number; name: string }) => void;
}

const UserSedeSelector = ({
  currentValue,
  options,
  isUpdating,
  onValueChange,
}: UserSedeSelectorProps) => {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <p className="text-sm text-gray-500">Sede:</p>
      <Badge variant="outline">{currentValue.name}</Badge>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isUpdating}
            className="ml-2"
          >
            Cambiar Sede
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Seleccionar nueva sede</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {options.map((option) => (
            <DropdownMenuItem
              key={option.id}
              onClick={() => onValueChange(option)}
              disabled={option.id === currentValue.id}
            >
              {option.name}
              {option.id === currentValue.id && "(Actual)"}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserSedeSelector;
