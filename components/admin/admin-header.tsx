import React, { ReactNode } from "react";
import Link from "next/link";

interface AdminHeaderProps {
  title: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Reusable header component for admin pages
 * Includes the page title and a back to admin button
 * Optional children for additional actions/buttons
 */
export default function AdminHeader({
  title,
  children,
  className = "",
}: AdminHeaderProps) {
  return (
    <div className={`flex justify-between items-center mb-6 ${className}`}>
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center gap-3">
        {children}
        <Link 
          href="/admin" 
          className="px-4 py-4 bg-[color-mix(in_srgb,#ffffff_10%,transparent)] hover:bg-[color-mix(in_srgb,#ffffff_20%,transparent)] text-primary font-mono font-medium uppercase text-[12px] leading-none"
        >
          Back to Admin
        </Link>
      </div>
    </div>
  );
} 