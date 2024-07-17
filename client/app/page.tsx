import { Button } from "@/features/ui/button";
import { getUser } from "@/features/users/actions";
import Link from "next/link";
import { UserMenu } from "@/features/users/menu";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUser();
  if (user && !user.confirmedAt) redirect("/confirm/required");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {user ? (
        <UserMenu user={user} />
      ) : (
        <Button asChild>
          <Link href="/auth/login">Login</Link>
        </Button>
      )}
    </main>
  );
}
