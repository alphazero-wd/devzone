import * as z from "zod";
import { PASSWORD_REGEX } from "@/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useToast } from "@/features/ui/use-toast";
import { AxiosError } from "axios";
import { updatePassword } from "./update-password";

const formSchema = z
  .object({
    password: z.string().min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .regex(PASSWORD_REGEX, { message: "New password is not strong enough" }),
    confirmNewPassword: z
      .string()
      .min(1, { message: "Confirm new password is required" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

export const usePasswordSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async ({
    password,
    newPassword,
  }: z.infer<typeof formSchema>) => {
    setLoading(true);
    setTimeout(async () => {
      try {
        await updatePassword(password, newPassword);
        toast({
          variant: "success",
          title: "Password updated successfully",
        });
        form.reset();
      } catch (error: any) {
        if (error instanceof AxiosError && error.response?.status === 400) {
          form.setError("password", { message: error.response.data.message });
        } else
          toast({
            variant: "error",
            title: "Failed to update password",
            description:
              error instanceof AxiosError
                ? error.response?.data.message
                : error?.message,
          });
      } finally {
        setLoading(false);
      }
    }, 2000);
  };
  return { loading, form, onSubmit };
};
