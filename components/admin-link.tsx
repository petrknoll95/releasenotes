import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "./ui/button";

export default async function AdminLink() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }
  
  // Check if user is in admin_users table
  const { data: adminData } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single();
    
  // Only show admin link for admins and editors
  if (adminData && ['admin', 'editor'].includes(adminData.role)) {
    return (
      <div className="fixed bottom-4 right-4 z-50 opacity-50 hover:opacity-100 transition-opacity">
        <Button asChild size="sm" variant="outline">
          <Link href="/admin">Admin</Link>
        </Button>
      </div>
    );
  }
  
  return null;
} 