import React from "react";
import AdminEditButton from "./admin-edit-button";
import AdminDeleteButton from "./admin-delete-button";

interface AdminTableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

/**
 * Combines edit and delete buttons for admin tables
 */
export default function AdminTableActions({
  onEdit,
  onDelete,
  className = "",
}: AdminTableActionsProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <AdminEditButton onClick={onEdit} />
      <AdminDeleteButton onClick={onDelete} />
    </div>
  );
} 