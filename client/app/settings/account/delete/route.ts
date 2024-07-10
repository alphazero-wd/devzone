import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE() {
  const supabase = createClient(process.env.SERVICE_ROLE_KEY!);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized", data: null });
  const { data, error } = await supabase.auth.admin.deleteUser(user.id);
  return NextResponse.json({ data, error });
}
