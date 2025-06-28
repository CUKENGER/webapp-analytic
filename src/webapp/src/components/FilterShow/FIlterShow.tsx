import { Check } from "lucide-react";
import {
  FiltersType,
  FilterValueType,
} from "@/components/ReportTable/ReportTable.types";

export const FilterShow = ({
  selectedFilter,
  selectedFilters,
  setFilter,
  options,
  onClose,
}: {
  selectedFilter: string;
  selectedFilters: FilterValueType[];
  setFilter: (value: FilterValueType) => void;
  options: FiltersType[];
  onClose?: () => void;
}) => {
  const items = selectedFilters
    .map((value) => options.find((filter) => filter.value === value))
    .filter((filter) => filter !== undefined);

  const handleSelect = (value: FilterValueType) => {
    setFilter(value); // Устанавливаем фильтр
    if (onClose) onClose(); // Закрываем меню
  };

  return (
    <div className="max-h-[60vh] min-h-[7rem] w-full rounded-lg overflow-y-auto hide-scrollbar">
      <div className="pt-0 space-y-1">
        <div className="space-y-1">
          <div className="space-y-1 px-4 mt-2 pt-0 divide-y-[1px] divide-gray-stroke pb-2">
            {items.map(({ label, value }) => {
              const isSelected = selectedFilter === value;
              return (
                <button
                  key={value}
                  onClick={() => handleSelect(value)}
                  className="flex items-center justify-between w-full gap-2 p-2 font-medium text-left rounded-sm hover:bg-tg-secondary whitespace-nowrap"
                >
                  <span
                    className={`truncate w-[90%] ${isSelected ? "text-tg-text" : "text-tg-hint"}`}
                  >
                    {label}
                  </span>
                  {isSelected && <Check className="w-5 h-5 text-tg-link" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 w-full pointer-events-none h-14 bg-gradient-to-t from-dropdown-shadow-color to-transparent"></div>
    </div>
  );
};
