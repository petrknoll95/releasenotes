import React, { InputHTMLAttributes, useRef, useState } from "react";

interface AdminFileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  previewUrl?: string | null;
  onFileChange: (file: File | null) => void;
  onRemove?: () => void;
  className?: string;
  previewClassName?: string;
}

/**
 * Reusable file upload component for admin forms
 */
export default function AdminFileUpload({
  label,
  required = false,
  error,
  helpText,
  previewUrl,
  onFileChange,
  onRemove,
  className = "",
  previewClassName = "",
  ...props
}: AdminFileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(file);
  };
  
  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block font-mono text-[12px] font-medium uppercase mb-2">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {previewUrl && (
        <div className={`flex items-center gap-4 mb-2 ${previewClassName}`}>
          <div className="w-20 h-20 border border-[var(--border-secondary)] overflow-hidden flex items-center justify-center bg-[var(--background-tertiary)]">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <button 
            type="button" 
            onClick={handleRemove}
            className="text-red-500 font-mono text-[12px] font-medium uppercase"
          >
            Remove
          </button>
        </div>
      )}
      
      <div className="flex gap-2 items-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="w-full p-2 border-[var(--border-secondary)] bg-[var(--background-tertiary)] text-primary font-mono text-[14px]"
          {...props}
          required={required && !previewUrl}
        />
      </div>
      
      {helpText && (
        <p className="mt-1 text-[var(--text-secondary)] font-mono text-[12px]">{helpText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-red-500 text-[12px]">{error}</p>
      )}
    </div>
  );
} 