import { createClient } from "@/utils/supabase/server";
import AuthButton from "@/components/auth-button";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
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
    <div className="flex w-full h-screen">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <AuthButton />
          </div>
          
          {/* Admin Tools */}
          <div className="mb-4">
            <div className="space-y-2">
              <Button asChild className="w-full p-12 bg-[#DDDDDD] hover:bg-[#BBBBBB] flex justify-start items-center text-mono font-medium uppercase text-[12px] leading-none text-[var(--background)]">
                <Link href="/admin/episodes">Manage Episodes</Link>
              </Button>
              <Button asChild className="w-full p-12 bg-[#DDDDDD] hover:bg-[#BBBBBB] flex justify-start items-center text-mono font-medium uppercase text-[12px] leading-none text-[var(--background)]">
                <Link href="/admin/guests">Manage Guests</Link>
              </Button>
              <Button asChild className="w-full p-12 bg-[#DDDDDD] hover:bg-[#BBBBBB] flex justify-start items-center text-mono font-medium uppercase text-[12px] leading-none text-[var(--background)]">
                <Link href="/admin/sponsors">Manage Sponsors</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 