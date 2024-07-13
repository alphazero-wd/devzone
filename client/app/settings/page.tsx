import { SettingsClient } from "@/features/settings";
import { getUser } from "@/features/users/actions";
import { redirect } from "next/navigation";
import { Button } from "@/features/ui/button";
import Link from "next/link";
import { ChevronLeftIcon } from "@radix-ui/react-icons";

export default async function SettingsPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");

  return (
    <main className="flex flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="grid relative w-full max-w-2xl container items-start gap-6">
        <div className="flex items-center gap-x-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            asChild
          >
            <Link href="/">
              <ChevronLeftIcon className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="text-xl tracking-tight font-bold">Settings</h1>
        </div>
        <SettingsClient user={user} />
      </div>
    </main>
  );
}
