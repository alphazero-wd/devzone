import { LoginForm } from "@/features/auth/login/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/features/ui/card";
import { Button } from "@/features/ui/button";
import Link from "next/link";
import { getUser } from "@/features/users/actions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Log in to your account",
};

export default async function LoginPage() {
  const user = await getUser();
  if (user) redirect("/");

  return (
    <div className="h-full w-full flex justify-center items-center">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="text-center text-sm w-full">
          Don&apos;t have an account?{" "}
          <Button className="w-fit h-fit p-0 ml-1" variant="link" asChild>
            <Link href="/auth/signup">Sign up</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
