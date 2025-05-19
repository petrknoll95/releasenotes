import { createClient } from "@/utils/supabase/server";
import AuthButton from "@/components/auth-button";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar/sidebar";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if user is in admin_users table
  const { data: adminData } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single();
    
  // Only allow access to admins and editors
  if (!adminData || !['admin', 'editor'].includes(adminData.role)) {
    return redirect("/");
  }

  return (
    <div className="flex w-full h-screen">
      <Sidebar />
      
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <AuthButton />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Content Management</h2>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/episodes">Manage Episodes</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/guests">Manage Guests</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/sponsors">Manage Sponsors</Link>
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">User Management</h2>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/users">Manage Admin Users</Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button asChild variant="outline">
              <Link href="/">Back to site</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 