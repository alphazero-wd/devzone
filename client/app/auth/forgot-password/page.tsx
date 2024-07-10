import { ForgotPassword } from "@/features/auth/forgot-password";
import { getUser } from "@/features/users/actions";
import { redirect } from "next/navigation";

export default async function ForgotPasswordPage() {
  const user = await getUser();
  if (user) redirect("/");
  return <ForgotPassword />;
}
