import { Button } from "@/features/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/features/ui/form";
import { Input } from "@/features/ui/input";
import { Spinner } from "@/features/ui/spinner";
import { Label } from "@/features/ui/label";
import { useEmailSettings } from "./use-email-settings";

export const EmailInputForm = ({ email }: { email: string }) => {
  const { form, loading, onSubmit } = useEmailSettings(email);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="email">Email</Label>
              <Input
                isInvalid={form.getFieldState("email").invalid}
                id="email"
                disabled={loading}
                {...field}
                placeholder="m@example.com"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="py-4 border-t flex items-center gap-x-4">
          <Button type="submit" disabled={loading} className="w-fit gap-x-2">
            {loading && <Spinner />} {loading ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
