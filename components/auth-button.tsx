import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    // Don't show any auth UI if env vars aren't set
    return null;
  }
  
  // Only show sign out button if user is logged in
  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm">Signed in as {user.email}</span>
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"} size="sm">
          Sign out
        </Button>
      </form>
    </div>
  ) : null; // Don't show anything if not logged in
}
