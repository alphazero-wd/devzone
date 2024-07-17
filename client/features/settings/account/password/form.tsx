"use client";
import { Label } from "@/features/ui/label";
import { Button } from "@/features/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/features/ui/form";
import { Input } from "@/features/ui/input";
import { Spinner } from "@/features/ui/spinner";
import { usePasswordSettings } from "./use-password-settings";

export const PasswordSettingsForm = () => {
  const { loading, form, onSubmit } = usePasswordSettings();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="password">Current password</Label>
              <Input
                disabled={loading}
                isInvalid={form.getFieldState("password").invalid}
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
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="newPassword">New password</Label>

              <Input
                disabled={loading}
                id="newPassword"
                isInvalid={form.getFieldState("newPassword").invalid}
                {...field}
                type="password"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="confirmNewPassword">Confirm new password</Label>
              <Input
                disabled={loading}
                id="confirmNewPassword"
                isInvalid={form.getFieldState("confirmNewPassword").invalid}
                {...field}
                type="password"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} className="w-fit gap-x-2">
          {loading && <Spinner />} {loading ? "Updating..." : "Update"}
        </Button>
      </form>
    </Form>
  );
};
