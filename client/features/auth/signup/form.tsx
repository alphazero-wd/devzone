"use client";
import { Button } from "@/features/ui/button";
import { Input } from "@/features/ui/input";
import { Label } from "@/features/ui/label";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/features/ui/form";
import { useSignup } from "./use-signup";
import { Spinner } from "@/features/ui/spinner";

export const SignupForm = () => {
  const { form, loading, onSubmit } = useSignup();
  return (
    <div className="grid gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <Label htmlFor="name">Your name</Label>
                <Input
                  disabled={loading}
                  {...field}
                  id="name"
                  placeholder="Tim Foo"
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  disabled={loading}
                  {...field}
                  placeholder="m@example.com"
                />
                <FormDescription>
                  Your email will be kept private
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="password">Password</Label>
                <Input
                  disabled={loading}
                  id="password"
                  {...field}
                  type="password"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Spinner /> : "Create account"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
