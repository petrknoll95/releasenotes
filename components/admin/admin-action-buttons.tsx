import React from "react";
import AdminFormButton from "./admin-form-button";
import AdminCancelButton from "./admin-cancel-button";

interface AdminActionButtonsProps {
  isSubmitting: boolean;
  isUploading?: boolean;
  isEditing: boolean;
  entityName: string;
  onCancel?: () => void;
  className?: string;
}

/**
 * Combines the form submit and cancel buttons in a consistent layout
 * for admin forms across the application
 */
export default function AdminActionButtons({
  isSubmitting,
  isUploading = false,
  isEditing,
  entityName,
  onCancel,
  className = "",
}: AdminActionButtonsProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <AdminFormButton
        isSubmitting={isSubmitting}
        isUploading={isUploading}
        isEditing={isEditing}
        entityName={entityName}
      />
      
      {isEditing && onCancel && (
        <AdminCancelButton onCancel={onCancel} />
      )}
    </div>
  );
} 