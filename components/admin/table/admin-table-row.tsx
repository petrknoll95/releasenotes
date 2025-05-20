import React, { ReactNode } from "react";

interface AdminTableRowProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  isClickable?: boolean;
}

/**
 * Standardized table row for admin tables
 */
export default function AdminTableRow({
  children,
  onClick,
  className = "",
  isClickable = false,
}: AdminTableRowProps) {
  return (
    <tr 
      className={`border-b border-[var(--border-secondary)] hover:bg-[var(--background-tertiary)] ${
        isClickable ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={isClickable ? onClick : undefined}
    >
      {children}
    </tr>
  );
} 