import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/features/ui/card";
import { ResetPasswordForm } from "@/features/auth/reset-password/form";
import { getUser } from "@/features/users/actions";
import { redirect } from "next/navigation";
import { UUID_REGEX } from "../../../../constants";
import { CircleAlert } from "lucide-react";

interface ResetPasswordPageParams {
  searchParams: {
    token?: string;
  };
}

export default async function ResetPasswordPage({
  searchParams: { token },
}: ResetPasswordPageParams) {
  const user = await getUser();
  if (user) redirect("/");

  return (
    <div className="h-full w-full flex justify-center items-center">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Update and confirm your new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm token={token} />
        </CardContent>
      </Card>
    </div>
  );
}
