import React, { SelectHTMLAttributes } from "react";

interface AdminSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
  emptyOption?: string;
  className?: string;
}

/**
 * Reusable select dropdown component for admin forms
 */
export default function AdminSelect({
  label,
  options,
  required = false,
  error,
  emptyOption = "None",
  className = "",
  ...props
}: AdminSelectProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block font-mono text-[12px] font-medium uppercase mb-2">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        className="w-full p-2 border-[var(--border-secondary)] bg-[var(--background-tertiary)] text-primary font-mono text-[14px]"
        {...props}
        required={required}
      >
        <option value="">{emptyOption}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-red-500 text-[12px]">{error}</p>
      )}
    </div>
  );
} 