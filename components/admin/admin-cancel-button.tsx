import React from "react";

interface AdminCancelButtonProps {
  onCancel: () => void;
  className?: string;
}

/**
 * Cancel button for admin forms when editing
 */
export default function AdminCancelButton({
  onCancel,
  className = "",
}: AdminCancelButtonProps) {
  return (
    <button
      type="button"
      onClick={onCancel}
      className={`px-4 py-4 bg-[color-mix(in_srgb,#ffffff_5%,transparent)] hover:bg-[color-mix(in_srgb,#ffffff_10%,transparent)] text-primary font-mono font-medium uppercase text-[12px] leading-none ${className}`}
    >
      Cancel
    </button>
  );
} 