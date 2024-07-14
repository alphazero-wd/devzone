import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useToast } from "@/features/ui/use-toast";
import { PASSWORD_REGEX, UUID_REGEX } from "@/constants";
import { resetPassword } from "./reset";
import { AxiosError } from "axios";

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
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const token = useMemo(
    () => searchParams.get("token"),
    [searchParams.get("token")]
  );

  const validateToken = () => {
    let message: string = "";
    if (!token || !UUID_REGEX.test(token)) {
      if (!token) message = "Token is missing";
      else if (!UUID_REGEX.test(token)) message = "Invalid token";
      throw new Error(message);
    }
  };

  function onSubmit({ password }: z.infer<typeof formSchema>) {
    setLoading(true);
    setTimeout(async () => {
      try {
        validateToken();
        await resetPassword(password, token!);
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
        console.log({ error });

        const { dismiss } = toast({
          variant: "error",
          title: "Failed to reset password",
          description:
            error instanceof AxiosError
              ? error.response?.data.message
              : error.message,
        });
        setTimeout(dismiss, 2000);
      } finally {
        setLoading(false);
      }
    }, 1000);
  }
  return { form, onSubmit, loading };
};
