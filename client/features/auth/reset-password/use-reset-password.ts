import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useToast } from "@/features/ui/use-toast";
import { PASSWORD_REGEX, UUID_REGEX } from "@/constants";
import { resetPassword } from "./reset";
import { isAxiosError } from "axios";
import { timeout } from "@/features/common/utils";
import { login } from "../actions/login";

const formSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .regex(PASSWORD_REGEX, {
        message: "Password is not strong enough",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const useResetPassword = (token?: string) => {
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

  const validateToken = () => {
    let message: string = "";
    if (!token || !UUID_REGEX.test(token)) {
      if (!token) message = "Token is missing";
      else if (!UUID_REGEX.test(token))
        message = "Token is not correctly formatted";
      throw new Error(message);
    }
  };

  async function onSubmit({ password }: z.infer<typeof formSchema>) {
    setLoading(true);
    await timeout();
    try {
      validateToken();
      await resetPassword(password, token!);
      const { dismiss } = toast({
        variant: "success",
        title: "Password reset successfully",
        description: "Now log in again with your new password",
      });
      form.reset();
      setTimeout(() => {
        dismiss();
        router.replace("/auth/login");
        router.refresh();
      }, 2000);
    } catch (error: any) {
      const { dismiss } = toast({
        variant: "error",
        title: "Failed to reset password",
        description: isAxiosError(error)
          ? error.response?.data.message
          : error.message,
      });
      setTimeout(dismiss, 2000);
    } finally {
      setLoading(false);
    }
  }
  return { form, onSubmit, loading };
};
