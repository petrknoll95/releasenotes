import { createClient } from "@/utils/supabase/server";
import AuthButton from "@/components/auth-button";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar/sidebar";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex w-full h-screen">
      <Sidebar />
      
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <AuthButton />
          </div>
          
          <div className="border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-2">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Account created:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <Button asChild variant="outline">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
