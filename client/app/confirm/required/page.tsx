import { getUser } from "@/features/users/actions";
import { MailIcon } from "lucide-react";
import { SendEmailButton } from "@/features/auth/confirm-email";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Confirm your account",
};

export default async function ConfirmRequiredPage() {
  const user = await getUser();

  if (!user || user.confirmedAt) redirect("/");

  return (
    <main className="flex justify-center items-center h-full w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-md container text-center space-y-4">
        <div className="rounded-full flex items-center justify-center mx-auto w-12 h-12 border border-muted-foreground">
          <MailIcon
            strokeWidth={1}
            className="w-6 h-6 mx-auto text-secondary-foreground"
          />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Confirm your email
        </h2>
        <p className="text-muted-foreground text-lg">
          Please confirm your account by clicking the link sent to {user.email}
        </p>
        <SendEmailButton email={user.email} />
      </div>
    </main>
  );
}
