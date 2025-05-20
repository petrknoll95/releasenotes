import React, { ReactNode } from "react";

interface AdminTableProps {
  children: ReactNode;
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
  isEmpty?: boolean;
  className?: string;
}

/**
 * Main table container for admin tables
 */
export default function AdminTable({
  children,
  loading = false,
  loadingText = "Loading...",
  emptyText = "No items found",
  isEmpty = false,
  className = "",
}: AdminTableProps) {
  return (
    <div className="overflow-x-auto">
      {loading ? (
        <p className="p-4 text-center text-[var(--text-secondary)] font-mono text-[14px]">{loadingText}</p>
      ) : isEmpty ? (
        <p className="p-4 text-center text-[var(--text-secondary)] font-mono text-[14px]">{emptyText}</p>
      ) : (
        <table className={`w-full text-sm ${className}`}>
          {children}
        </table>
      )}
    </div>
  );
} 