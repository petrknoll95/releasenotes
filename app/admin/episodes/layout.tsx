import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function EpisodesAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // With the updated schema, any authenticated user can access admin
  // No admin_users table check needed anymore

  return (
    <div className="bg-[var(--background)]">
      {children}
    </div>
  );
} 