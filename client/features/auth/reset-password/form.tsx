"use client";
import { Label } from "@/features/ui/label";
import { Input } from "@/features/ui/input";
import { Button } from "@/features/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/features/ui/form";
import { Spinner } from "@/features/ui/spinner";
import { useResetPassword } from "./use-reset-password";
import { cn } from "@/lib/utils";

export const ResetPasswordForm = () => {
  const { form, onSubmit, loading } = useResetPassword();
  return (
    <div className="grid gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="password">Password</Label>
                <Input
                  isInvalid={form.getFieldState("password").invalid}
                  disabled={loading}
                  id="password"
                  {...field}
                  type="password"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  isInvalid={form.getFieldState("confirmPassword").invalid}
                  disabled={loading}
                  id="confirmPassword"
                  {...field}
                  type="password"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="w-full gap-x-2">
            {loading ? <Spinner /> : "Reset password"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
