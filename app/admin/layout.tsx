import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import "../globals.css";

export default async function AdminLayout({
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

  return (
    <div className="bg-[var(--background)] min-h-screen">
      {children}
    </div>
  );
} 