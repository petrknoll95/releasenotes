import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({
      status: "unauthenticated",
      isAdmin: false,
      userId: null,
      error: "User not authenticated",
    });
  }

  // With the updated schema, all authenticated users can access admin features
  const isAdmin = true;

  return NextResponse.json({
    status: "authenticated",
    isAdmin,
    userId: user.id,
    userEmail: user.email,
    message: "All authenticated users now have admin access with the updated schema"
  });
} 