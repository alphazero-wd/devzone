"use client";
import { Button } from "@/features/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/features/ui/card";
import Link from "next/link";
import { ForgotPasswordForm } from "@/features/auth/forgot-password/form";
import { useForgotPassword } from "./use-forgot-password";

export function ForgotPassword() {
  const { hasEmailSent, goBackToChangeEmail, ...formStatus } =
    useForgotPassword();
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            {hasEmailSent
              ? "Password reset link sent"
              : "Forgot your password?"}
          </CardTitle>
          <CardDescription>
            {!hasEmailSent
              ? "Enter your email and we'll sent a password reset link to your inbox."
              : "Check your inbox for link to reset your password."}
          </CardDescription>
        </CardHeader>
        {!hasEmailSent && (
          <CardContent>
            <ForgotPasswordForm {...formStatus} />
          </CardContent>
        )}
        <CardFooter className="text-center text-sm w-full">
          {hasEmailSent && "Not the right email? "}
          <Button
            onClick={goBackToChangeEmail}
            className="w-fit h-fit p-0 ml-1"
            variant="link"
            asChild={!hasEmailSent}
          >
            {hasEmailSent ? (
              <>Change</>
            ) : (
              <Link href="/auth/login">Log in</Link>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
