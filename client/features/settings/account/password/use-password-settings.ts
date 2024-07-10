import * as z from "zod";
import { PASSWORD_REGEX } from "@/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useToast } from "@/features/ui/use-toast";

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
  const supabase = createClient();
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

  const validatePassword = async (oldPassword: string) => {
    const { error } = await supabase.rpc("validate_user_password", {
      plain_password: oldPassword,
    });
    return error;
  };
  const updatePassword = async (newPassword: string) => {
    const { error: passwordUpdateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (passwordUpdateError)
      toast({
        variant: "error",
        title: "Password update failed!",
        description: passwordUpdateError.message,
      });
    else
      toast({
        variant: "success",
        title: "Password updated successfully",
      });
    form.reset();
    setLoading(false);
  };

  const onSubmit = async ({
    password,
    newPassword,
  }: z.infer<typeof formSchema>) => {
    setLoading(true);
    setTimeout(async () => {
      const error = await validatePassword(password);
      if (error) {
        form.setError("password", { message: error.message });
        setLoading(false);
        return;
      }
      await updatePassword(newPassword);
    }, 2000);
  };
  return { loading, form, onSubmit };
};
