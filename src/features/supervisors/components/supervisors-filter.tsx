"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  label: string;
  key: string;
  options: FilterOption[];
}

interface FilterPopoverProps {
  filters: FilterGroup[];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export function FilterPopover({
  filters,
  activeFilters,
  onFilterChange,
  onClearFilters,
}: FilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-1.5"
      >
        <Filter className="size-3.5" />
        <span>Filter</span>
        {activeCount > 0 && (
          <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {activeCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-border bg-card p-3 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground">Filters</p>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={onClearFilters}
                  className="text-[10px] font-medium text-primary hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-3">
              {filters.map((group) => (
                <div key={group.key} className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {group.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          onFilterChange(
                            group.key,
                            activeFilters[group.key] === option.value
                              ? ""
                              : option.value
                          )
                        }
                        className={cn(
                          "rounded-md border px-2 py-1 text-[10px] font-medium transition-colors",
                          activeFilters[group.key] === option.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
