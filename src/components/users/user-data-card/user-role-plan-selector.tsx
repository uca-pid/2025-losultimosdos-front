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
import {
  capitalizeFirstLetter,
  getPlanBadgeColor,
  getRoleBadgeColor,
} from "@/lib/user-utils";

interface UserRolePlanSelectorProps<T extends string = string> {
  type: "role" | "plan";
  currentValue: T;
  options: readonly T[];
  isUpdating: boolean;
  onValueChange: (newValue: T) => void;
}

export const UserRolePlanSelector = <T extends string = string>({
  type,
  currentValue,
  options,
  isUpdating,
  onValueChange,
}: UserRolePlanSelectorProps<T>) => {
  const getColorFn = type === "role" ? getRoleBadgeColor : getPlanBadgeColor;
  const label = type === "role" ? "Rol" : "Plan";

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <p className="text-sm text-gray-500">{label}:</p>
      <Badge variant="outline" className={getColorFn(currentValue)}>
        {capitalizeFirstLetter(currentValue)}
      </Badge>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isUpdating}
            className="ml-2"
          >
            {`Cambiar ${label}`}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {`Seleccionar nuevo ${label.toLowerCase()}`}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {options.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => onValueChange(option)}
              disabled={option === currentValue}
            >
              <Badge variant="outline" className={`${getColorFn(option)} mr-2`}>
                {capitalizeFirstLetter(option)}
              </Badge>
              {option === currentValue && "(Actual)"}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
