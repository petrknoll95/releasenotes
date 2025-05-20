import React, { ReactNode } from "react";

interface AdminTableCellProps {
  children: ReactNode;
  className?: string;
}

/**
 * Standardized table cell for admin tables
 */
export default function AdminTableCell({
  children,
  className = "",
}: AdminTableCellProps) {
  return (
    <td className={`p-2 font-mono text-[14px] ${className}`}>
      {children}
    </td>
  );
} 