import React from "react";

interface AdminDeleteButtonProps {
  onClick: () => void;
  className?: string;
}

/**
 * Reusable delete button for admin tables
 */
export default function AdminDeleteButton({
  onClick,
  className = "",
}: AdminDeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-2 bg-red-500 text-white font-mono font-medium uppercase text-[10px] leading-none hover:bg-red-600 ${className}`}
    >
      Delete
    </button>
  );
} 