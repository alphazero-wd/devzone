"use client";
import { Label } from "@/features/ui/label";
import { Input } from "@/features/ui/input";
import { Button } from "@/features/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/features/ui/form";
import { Spinner } from "@/features/ui/spinner";
import { UseFormReturn } from "react-hook-form";

interface ForgotPasswordFormProps {
  form: UseFormReturn<
    {
      email: string;
    },
    any,
    undefined
  >;
  onSubmit: (values: { email: string }) => void;
  loading: boolean;
}

export const ForgotPasswordForm = ({
  form,
  onSubmit,
  loading,
}: ForgotPasswordFormProps) => {
  return (
    <div className="grid gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  isInvalid={form.getFieldState("email").invalid}
                  disabled={loading}
                  {...field}
                  placeholder="m@example.com"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="w-full gap-x-2">
            {loading && <Spinner />}
            {loading ? "Sending..." : "Send email"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
