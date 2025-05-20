import React from "react";

interface AdminTableHeaderProps {
  columns: string[];
  className?: string;
}

/**
 * Standardized header row for admin tables
 */
export default function AdminTableHeader({
  columns,
  className = "",
}: AdminTableHeaderProps) {
  return (
    <thead>
      <tr className="border-b border-[var(--border-secondary)]">
        {columns.map((column, index) => (
          <th 
            key={index} 
            className={`text-left p-2 font-mono text-[12px] font-medium uppercase text-[var(--text-secondary)] ${className}`}
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
} 