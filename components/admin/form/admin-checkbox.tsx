import React, { InputHTMLAttributes } from "react";

interface AdminCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  className?: string;
}

/**
 * Reusable checkbox component for admin forms
 */
export default function AdminCheckbox({
  label,
  error,
  className = "",
  ...props
}: AdminCheckboxProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          className="mr-2 border-[var(--border-secondary)] bg-[var(--background-tertiary)]"
          {...props}
        />
        <label className="font-mono text-[12px] font-medium uppercase">
          {label}
        </label>
      </div>
      {error && (
        <p className="mt-1 text-red-500 text-[12px]">{error}</p>
      )}
    </div>
  );
} 