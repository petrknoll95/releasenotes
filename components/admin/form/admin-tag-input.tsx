import React, { useState, useRef, useEffect } from 'react';

export interface TagOption {
  value: string;
  label: string;
}

interface AdminTagInputProps {
  label: string;
  options: TagOption[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  error?: string;
  helpText?: string;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
}

export default function AdminTagInput({
  label,
  options,
  selectedValues,
  onChange,
  error,
  helpText,
  emptyMessage,
  emptyAction
}: AdminTagInputProps) {
  const [search, setSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Filter options based on search term and exclude already selected items
  const filteredOptions = options.filter(
    option => 
      !selectedValues.includes(option.value) && 
      option.label.toLowerCase().includes(search.toLowerCase())
  );
  
  // Get selected options in order
  const selectedOptions = selectedValues.map(
    value => options.find(option => option.value === value)
  ).filter(option => option !== undefined) as TagOption[];
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Add a tag
  const addTag = (value: string) => {
    onChange([...selectedValues, value]);
    setSearch('');
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };
  
  // Remove a tag
  const removeTag = (value: string) => {
    onChange(selectedValues.filter(v => v !== value));
  };
  
  // Handle input focus
  const handleFocus = () => {
    setIsDropdownOpen(true);
  };
  
  // Handle input keydown for navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !search && selectedValues.length > 0) {
      // Remove the last tag when backspace is pressed with empty input
      removeTag(selectedValues[selectedValues.length - 1]);
    }
  };
  
  return (
    <div className="mb-4">
      <label className="block font-mono text-[12px] font-medium uppercase mb-2">
        {label}
      </label>
      
      <div className="relative">
        <div 
          className="flex flex-wrap items-center gap-2 p-2 border-[var(--border-secondary)] bg-[var(--background-tertiary)] w-full min-h-[42px]"
          onClick={() => inputRef.current?.focus()}
        >
          {selectedOptions.map((option) => (
            <div 
              key={option.value} 
              className="flex items-center gap-1 px-2 py-1 bg-[var(--background-secondary)] text-sm"
            >
              <span className="font-mono text-[12px]">{option.label}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(option.value);
                }}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                ×
              </button>
            </div>
          ))}
          
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder={selectedValues.length ? "" : "Add a tag"}
            className="flex-grow bg-transparent outline-none min-w-[120px] text-[14px] font-mono"
          />
        </div>
        
        {isDropdownOpen && filteredOptions.length > 0 && (
          <div 
            ref={dropdownRef}
            className="absolute z-10 w-full mt-1 max-h-[200px] overflow-y-auto bg-[var(--background-tertiary)] border border-[var(--border-secondary)]"
          >
            {filteredOptions.map(option => (
              <div
                key={option.value}
                className="p-2 cursor-pointer hover:bg-[var(--background-secondary)] font-mono text-[14px]"
                onClick={() => addTag(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-red-500 text-[12px]">{error}</p>
      )}
      
      {helpText && (
        <p className="mt-1 text-[var(--text-secondary)] text-[12px]">{helpText}</p>
      )}
      
      {options.length === 0 && (
        <div className="mt-2 text-sm text-[var(--text-secondary)]">
          {emptyMessage || "No options available."}
          {emptyAction && <div className="mt-1">{emptyAction}</div>}
        </div>
      )}
    </div>
  );
} 