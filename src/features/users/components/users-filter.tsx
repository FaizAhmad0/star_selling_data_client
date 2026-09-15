"use client";

import { useState } from "react";
import { Filter, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  label: string;
  key: string;
  options?: FilterOption[];
  type?: "select" | "date" | "text" | "manager-select" | "platform-select";
  loading?: boolean;
  error?: string;
}

interface UsersFilterProps {
  filters: FilterGroup[];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  managerOptions?: FilterOption[];
  managerLoading?: boolean;
}

export function UsersFilter({
  filters,
  activeFilters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  managerOptions = [],
  managerLoading = false,
}: UsersFilterProps) {
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
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-border bg-card p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground">Filters</p>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={onClearFilters}
                  className="flex items-center gap-1 text-[10px] font-medium text-primary hover:underline"
                >
                  <X className="size-3" />
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-4">
              {filters.map((group) => (
                <div key={group.key} className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </p>
                  {group.type === "date" ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="date"
                        value={activeFilters[`${group.key}From`] || ""}
                        onChange={(e) => onFilterChange(`${group.key}From`, e.target.value)}
                        className="h-8 text-xs"
                        placeholder="From"
                      />
                      <span className="text-xs text-muted-foreground">to</span>
                      <Input
                        type="date"
                        value={activeFilters[`${group.key}To`] || ""}
                        onChange={(e) => onFilterChange(`${group.key}To`, e.target.value)}
                        className="h-8 text-xs"
                        placeholder="To"
                      />
                    </div>
                  ) : group.type === "manager-select" ? (
                    <div className="relative">
                      <select
                        value={activeFilters[group.key] || ""}
                        onChange={(e) => onFilterChange(group.key, e.target.value)}
                        disabled={managerLoading}
                        className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-7"
                      >
                        <option value="">{managerLoading ? "Loading..." : "All managers"}</option>
                        {managerOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  ) : group.type === "platform-select" ? (
                    <div className="relative">
                      <select
                        value={activeFilters[group.key] || ""}
                        onChange={(e) => onFilterChange(group.key, e.target.value)}
                        disabled={group.loading || Boolean(group.error)}
                        className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-7"
                      >
                        <option value="">{group.error || (group.loading ? "Loading..." : "All platforms")}</option>
                        {group.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  ) : group.options ? (
                    <div className="relative">
                      <select
                        value={activeFilters[group.key] || ""}
                        onChange={(e) => onFilterChange(group.key, e.target.value)}
                        className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-7"
                      >
                        <option value="">All {group.label.toLowerCase()}s</option>
                        {group.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  ) : (
                    <Input
                      placeholder={`Filter by ${group.label.toLowerCase()}...`}
                      value={activeFilters[group.key] || ""}
                      onChange={(e) => onFilterChange(group.key, e.target.value)}
                      className="h-8 text-xs"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => { onApplyFilters(); setIsOpen(false); }}>
                Apply Filters
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
