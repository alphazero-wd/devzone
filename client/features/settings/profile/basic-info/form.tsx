"use client";
import { Label } from "@/features/ui/label";
import { Button } from "@/features/ui/button";
import { Form, FormField, FormItem } from "@/features/ui/form";
import { Input } from "@/features/ui/input";
import { Spinner } from "@/features/ui/spinner";
import { useBasicInfoForm } from "./use-basic-info";

interface BasicInfoFormProps {
  profileId: string;
  firstName: string;
  lastName: string;
}

export const BasicInfoForm = (props: BasicInfoFormProps) => {
  const { form, loading, onSubmit, cancelChanges } = useBasicInfoForm(props);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  disabled={loading}
                  {...field}
                  id="firstName"
                  placeholder="Max"
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  disabled={loading}
                  {...field}
                  id="lastName"
                  placeholder="Robinson"
                />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-x-4">
          <Button
            variant="outline"
            type="button"
            disabled={loading}
            className="w-fit"
            onClick={cancelChanges}
          >
            Reset
          </Button>
          <Button className="w-fit gap-x-2" type="submit" disabled={loading}>
            {loading && <Spinner />} {loading ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
