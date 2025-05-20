import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsors Admin - Release Notes",
  description: "Manage sponsors for Release Notes podcast",
};

export default function SponsorsAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 