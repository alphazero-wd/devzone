import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/features/ui/use-toast";
import { sendResetPasswordEmail } from "./send-email";
import { isAxiosError } from "axios";
import { timeout } from "@/features/common/utils";

const formSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Invalid email provided",
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
      if (isAxiosError(error) && error.response?.status === 400) {
        form.setError("email", { message: error.response.data.message });
      } else
        toast({
          variant: "error",
          title: "Failed to send password reset email!",
          description: isAxiosError(error)
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
