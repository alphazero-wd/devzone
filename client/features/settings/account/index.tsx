import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/features/ui/card";
import { User } from "@supabase/supabase-js";
import { EmailSettings } from "./email";
import { PasswordSettings } from "./password";
import { DeleteAccount } from "./delete";

interface AccountSettingsProps {
  user: User | null;
}

export const AccountSettings = ({ user }: AccountSettingsProps) => {
  if (!user) return null;
  return (
    <div className="grid gap-y-4">
      <EmailSettings email={user.email!} />
      <PasswordSettings />
      <DeleteAccount />
    </div>
  );
};
