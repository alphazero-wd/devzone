import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/features/ui/use-toast";
import { sendResetPasswordEmail } from "./send-email";
import { AxiosError } from "axios";
import { timeout } from "@/features/common/utils";

const formSchema = z.object({
  email: z.string().min(1, { message: "Email is empty" }).email({
    message: "Invalid email provided.",
  }),
});

export const useForgotPassword = () => {
  const [hasEmailSent, setHasEmailSent] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    await timeout();
    try {
      await sendResetPasswordEmail(values.email);
      toast({
        variant: "info",
        title: "Password reset email sent",
        description: `Click on the link sent to ${values.email} to reset your password`,
      });
      setHasEmailSent(true);
    } catch (error: any) {
      toast({
        variant: "error",
        title: "Failed to send password reset email!",
        description:
          error instanceof AxiosError
            ? error.response?.data.message
            : error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  const goBackToChangeEmail = () => {
    setHasEmailSent(false);
  };

  return { form, onSubmit, loading, hasEmailSent, goBackToChangeEmail };
};
