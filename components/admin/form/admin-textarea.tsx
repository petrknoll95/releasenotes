import React, { TextareaHTMLAttributes } from "react";

interface AdminTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
}

/**
 * Reusable textarea component for admin forms
 */
export default function AdminTextarea({
  label,
  required = false,
  error,
  className = "",
  ...props
}: AdminTextareaProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block font-mono text-[12px] font-medium uppercase mb-2">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        className="w-full p-2 border-[var(--border-secondary)] bg-[var(--background-tertiary)] text-primary font-mono text-[14px] min-h-[100px]"
        {...props}
        required={required}
      />
      {error && (
        <p className="mt-1 text-red-500 text-[12px]">{error}</p>
      )}
    </div>
  );
} 