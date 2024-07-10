import { SignupForm } from "@/features/auth/signup/form";
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
  title: "Create new account",
};

export default async function LoginPage() {
  const user = await getUser();
  if (user) redirect("/");

  return (
    <div className="h-full w-full flex justify-center items-center">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
        <CardFooter className="text-center text-sm w-full">
          Already have an account?{" "}
          <Button className="w-fit h-fit p-0 ml-1" variant="link" asChild>
            <Link href="/auth/login">Log in</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
