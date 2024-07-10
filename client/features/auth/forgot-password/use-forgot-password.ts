import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/features/ui/use-toast";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email provided.",
  }),
});

const supabase = createClient();

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setTimeout(async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        { redirectTo: `${window.location.origin}/auth/reset-password` }
      );

      if (error)
        toast({
          variant: "error",
          title: "Failed to send password reset email!",
          description: error.message,
        });
      else {
        toast({
          variant: "success",
          title: "Password reset email sent!",
          description:
            "Click on the link sent to " +
            values.email +
            " to reset your password",
        });
        setHasEmailSent(true);
      }
      setLoading(false);
    }, 1000);
  }

  const goBackToChangeEmail = () => {
    setHasEmailSent(false);
  };

  return { form, onSubmit, loading, hasEmailSent, goBackToChangeEmail };
};
