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
      <span className="text-primary font-mono font-medium uppercase text-[12px] leading-none">Signed in as {user.email}</span>
      <form action={signOutAction}>
        <Button type="submit" className="bg-[color-mix(in_srgb,#ffffff_10%,transparent)] hover:bg-[color-mix(in_srgb,#ffffff_20%,transparent)] text-primary font-mono font-medium uppercase text-[12px] leading-none">
          Sign out
        </Button>
      </form>
    </div>
  ) : null; // Don't show anything if not logged in
}
