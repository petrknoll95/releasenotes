import React, { InputHTMLAttributes } from "react";

interface AdminInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
}

/**
 * Reusable text input component for admin forms
 */
export default function AdminInput({
  label,
  required = false,
  error,
  className = "",
  ...props
}: AdminInputProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block font-mono text-[12px] font-medium uppercase mb-2">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        className="w-full p-2 border-[var(--border-secondary)] bg-[var(--background-tertiary)] text-primary font-mono text-[14px]"
        {...props}
        required={required}
      />
      {error && (
        <p className="mt-1 text-red-500 text-[12px]">{error}</p>
      )}
    </div>
  );
} 