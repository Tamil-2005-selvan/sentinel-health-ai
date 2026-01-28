import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export interface FilterState {
  search: string;
  status: string;
  ward: string;
  riskScoreRange: [number, number];
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

interface PatientFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const wards = [
  "All Wards",
  "ICU",
  "Emergency",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Oncology",
  "General",
];

const statuses = [
  { value: "all", label: "All Status" },
  { value: "critical", label: "Critical" },
  { value: "warning", label: "Warning" },
  { value: "normal", label: "Normal" },
];

export const PatientFilters: React.FC<PatientFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      status: "all",
      ward: "All Wards",
      riskScoreRange: [0, 100],
      dateRange: { from: undefined, to: undefined },
    });
  };

  const activeFilterCount = [
    filters.search !== "",
    filters.status !== "all",
    filters.ward !== "All Wards",
    filters.riskScoreRange[0] !== 0 || filters.riskScoreRange[1] !== 100,
    filters.dateRange.from !== undefined || filters.dateRange.to !== undefined,
  ].filter(Boolean).length;

  return (
    <motion.div
      className="glass-card p-4 mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search patients by ID, name, or condition..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10 bg-background/50"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={filters.status}
            onValueChange={(value) => updateFilter("status", value)}
          >
            <SelectTrigger className="w-[140px] bg-background/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  <div className="flex items-center gap-2">
                    {status.value !== "all" && (
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full",
                          status.value === "critical" && "bg-destructive",
                          status.value === "warning" && "bg-warning",
                          status.value === "normal" && "bg-secondary"
                        )}
                      />
                    )}
                    {status.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {activeFilterCount}
              </Badge>
            )}
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                isExpanded && "rotate-180"
              )}
            />
          </Button>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="pt-4 mt-4 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Ward Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Ward</label>
            <Select
              value={filters.ward}
              onValueChange={(value) => updateFilter("ward", value)}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select ward" />
              </SelectTrigger>
              <SelectContent>
                {wards.map((ward) => (
                  <SelectItem key={ward} value={ward}>
                    {ward}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Risk Score Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Risk Score: {filters.riskScoreRange[0]} - {filters.riskScoreRange[1]}
            </label>
            <div className="pt-2">
              <Slider
                value={filters.riskScoreRange}
                onValueChange={(value) =>
                  updateFilter("riskScoreRange", value as [number, number])
                }
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-background/50",
                    !filters.dateRange.from && "text-muted-foreground"
                  )}
                >
                  {filters.dateRange.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "LLL dd")} -{" "}
                        {format(filters.dateRange.to, "LLL dd")}
                      </>
                    ) : (
                      format(filters.dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Select date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange.from}
                  selected={{
                    from: filters.dateRange.from,
                    to: filters.dateRange.to,
                  }}
                  onSelect={(range) =>
                    updateFilter("dateRange", {
                      from: range?.from,
                      to: range?.to,
                    })
                  }
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </motion.div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <motion.div
          className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.search}"
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter("search", "")}
              />
            </Badge>
          )}
          {filters.status !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter("status", "all")}
              />
            </Badge>
          )}
          {filters.ward !== "All Wards" && (
            <Badge variant="secondary" className="gap-1">
              Ward: {filters.ward}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter("ward", "All Wards")}
              />
            </Badge>
          )}
          {(filters.riskScoreRange[0] !== 0 ||
            filters.riskScoreRange[1] !== 100) && (
            <Badge variant="secondary" className="gap-1">
              Risk: {filters.riskScoreRange[0]}-{filters.riskScoreRange[1]}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter("riskScoreRange", [0, 100])}
              />
            </Badge>
          )}
          {(filters.dateRange.from || filters.dateRange.to) && (
            <Badge variant="secondary" className="gap-1">
              Date: {filters.dateRange.from && format(filters.dateRange.from, "MM/dd")}
              {filters.dateRange.to && ` - ${format(filters.dateRange.to, "MM/dd")}`}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() =>
                  updateFilter("dateRange", { from: undefined, to: undefined })
                }
              />
            </Badge>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
