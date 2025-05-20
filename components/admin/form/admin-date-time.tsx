import React, { InputHTMLAttributes } from "react";

type DateTimeType = "date" | "time" | "datetime-local";

interface AdminDateTimeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  type: DateTimeType;
  required?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
}

/**
 * Reusable date/time input component for admin forms
 */
export default function AdminDateTime({
  label,
  type,
  required = false,
  error,
  helpText,
  className = "",
  ...props
}: AdminDateTimeProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block font-mono text-[12px] font-medium uppercase mb-2">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        className="w-full p-2 border-[var(--border-secondary)] bg-[var(--background-tertiary)] text-primary font-mono text-[14px]"
        {...props}
        required={required}
      />
      {helpText && (
        <p className="mt-1 text-[var(--text-secondary)] text-[12px]">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-red-500 text-[12px]">{error}</p>
      )}
    </div>
  );
} 