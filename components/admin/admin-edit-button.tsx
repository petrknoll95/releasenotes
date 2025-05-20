import React from "react";

interface AdminEditButtonProps {
  onClick: () => void;
  className?: string;
}

/**
 * Reusable edit button for admin tables
 */
export default function AdminEditButton({
  onClick,
  className = "",
}: AdminEditButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-2 bg-[color-mix(in_srgb,#ffffff_10%,transparent)] text-primary font-mono font-medium uppercase text-[10px] leading-none hover:bg-[color-mix(in_srgb,#ffffff_20%,transparent)] ${className}`}
    >
      Edit
    </button>
  );
} 