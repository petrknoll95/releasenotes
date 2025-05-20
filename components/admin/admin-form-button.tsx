import React from "react";

interface AdminFormButtonProps {
  isSubmitting: boolean;
  isUploading?: boolean;
  isEditing: boolean;
  entityName: string; // "Episode", "Guest", "Sponsor"
  className?: string;
}

/**
 * Reusable button component for admin form submissions
 * Handles different states (submitting, editing) with appropriate text
 */
export default function AdminFormButton({
  isSubmitting,
  isUploading = false,
  isEditing,
  entityName,
  className = "",
}: AdminFormButtonProps) {
  // Determine button text based on state
  const getButtonText = () => {
    if (isSubmitting || isUploading) {
      return "Saving...";
    }
    
    if (isEditing) {
      return "Update";
    }
    
    return `Add ${entityName}`;
  };

  return (
    <button
      type="submit"
      className={`px-4 py-4 bg-[color-mix(in_srgb,#ffffff_10%,transparent)] hover:bg-[color-mix(in_srgb,#ffffff_20%,transparent)] text-primary font-mono font-medium uppercase text-[12px] leading-none ${
        (isSubmitting || isUploading) ? "opacity-70 cursor-not-allowed" : ""
      } ${className}`}
      disabled={isSubmitting || isUploading}
    >
      {getButtonText()}
    </button>
  );
} 