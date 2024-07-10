import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/features/ui/use-toast";
import { createClient } from "@/lib/supabase/client";
import { PASSWORD_REGEX } from "@/constants";

const supabase = createClient();

const formSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password is too short." })
      .regex(PASSWORD_REGEX, {
        message: "Password is not strong enough.",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const useResetPassword = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function onSubmit({ password }: z.infer<typeof formSchema>) {
    setLoading(true);
    setTimeout(async () => {
      try {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw new Error(error.message);
        const { dismiss } = toast({
          variant: "success",
          title: "Password reset successfully",
          description: "You'll be redirected to the home page",
        });
        form.reset();

        setTimeout(() => {
          dismiss();
          router.refresh();
          router.replace("/");
        }, 2000);
      } catch (error: any) {
        const { dismiss } = toast({
          variant: "error",
          title: "Reset password failed",
          description: error.message,
        });
        setTimeout(dismiss, 2000);
      } finally {
        setLoading(false);
      }
    }, 1000);
  }
  return { form, onSubmit, loading };
};
