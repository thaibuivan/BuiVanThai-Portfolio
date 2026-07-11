"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function MultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder,
  icon,
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const selectedCount = selectedValues.length;

  let displayValue = placeholder;
  if (selectedCount === 1) {
    displayValue = options.find((o) => o.value === selectedValues[0])?.label || placeholder;
  } else if (selectedCount > 1) {
    displayValue = `${selectedCount} tùy chọn`;
  }

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <div
        className="w-full h-12 pl-10 pr-4 bg-slate-50 hover:bg-slate-100/50 border border-transparent rounded-xl text-sm font-medium text-slate-700 flex items-center justify-between cursor-pointer transition-colors shadow-inner relative group"
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <div className="flex items-center gap-2 overflow-hidden w-full">
          <span className="truncate">{displayValue}</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform shrink-0 ml-2", isOpen && "rotate-180")} />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[220px] bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-50 py-2 max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <div
                key={option.value}
                className="flex items-center px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors group/item"
                onClick={() => toggleOption(option.value)}
              >
                <div className={cn(
                  "w-4 h-4 rounded border mr-3 flex items-center justify-center transition-colors shrink-0",
                  isSelected ? "bg-primary border-primary" : "border-slate-300 group-hover/item:border-primary/50"
                )}>
                  {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
                <span className={cn("text-sm font-medium truncate", isSelected ? "text-slate-900" : "text-slate-600")}>
                  {option.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
