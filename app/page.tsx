import { createClient } from "@/utils/supabase/server";
import AuthButton from "@/components/auth-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar/sidebar";
import Main from "@/components/main/main";
export default async function Home() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="w-full min-h-screen flex flex-row flex-wrap">
      <Sidebar />
      <Main />
    </div>
  );
}
