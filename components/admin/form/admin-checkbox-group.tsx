import React from "react";

interface Option {
  value: string;
  label: string;
}

interface AdminCheckboxGroupProps {
  label: string;
  options: Option[];
  selectedValues: string[];
  onChange: (value: string) => void;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  required?: boolean;
  error?: string;
  className?: string;
}

/**
 * Checkbox group for selecting multiple options
 */
export default function AdminCheckboxGroup({
  label,
  options,
  selectedValues,
  onChange,
  emptyMessage = "No options available",
  emptyAction,
  required = false,
  error,
  className = "",
}: AdminCheckboxGroupProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block font-mono text-[12px] font-medium uppercase mb-2">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="border border-[var(--border-secondary)] bg-[var(--background-tertiary)] p-2 max-h-40 overflow-y-auto">
        {options.length === 0 ? (
          <div className="text-[var(--text-secondary)] font-mono text-[12px]">
            <p>{emptyMessage}</p>
            {emptyAction && <div className="mt-2">{emptyAction}</div>}
          </div>
        ) : (
          <div className="space-y-1">
            {options.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`option-${option.value}`}
                  checked={selectedValues.includes(option.value)}
                  onChange={() => onChange(option.value)}
                  className="mr-2 border-[var(--border-secondary)]"
                />
                <label 
                  htmlFor={`option-${option.value}`} 
                  className="font-mono text-[14px] cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-red-500 text-[12px]">{error}</p>
      )}
    </div>
  );
} 