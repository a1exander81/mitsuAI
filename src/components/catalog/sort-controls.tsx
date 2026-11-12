"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS } from "@/lib/sort";
import type { SortKey } from "@/lib/types";

interface Props {
  value: SortKey;
  onChange: (value: SortKey) => void;
}

export function SortControls({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-muted-foreground">
        Sort
      </label>
      <Select value={value} onValueChange={(v) => onChange(v as SortKey)}>
        <SelectTrigger id="sort" className="h-10 w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
