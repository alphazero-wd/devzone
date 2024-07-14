import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/features/ui/use-toast";
import { initEmailChangeConfirmation } from "./init-email-change";
import { Axios, AxiosError } from "axios";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
});

export const useEmailSettings = (email: string) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    form.setValue("email", email);
  }, [email]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setTimeout(() => sendConfirmationEmail(values.email), 2000);
  };

  const sendConfirmationEmail = async (newEmail: string) => {
    try {
      await initEmailChangeConfirmation(newEmail);

      toast({
        variant: "info",
        title: "Confirm your email",
        description: "Click on the links sent to " + email + " and " + newEmail,
      });
    } catch (error: any) {
      if (error instanceof AxiosError && error.response?.status === 400)
        form.setError("email", { message: error.response.data.message });
      else
        toast({
          variant: "error",
          title: "Email update failed!",
          description:
            error instanceof AxiosError
              ? error.response?.data.message
              : error.message,
        });
    } finally {
      setLoading(false);
    }
  };

  return {
    onSubmit,
    loading,
    form,
  };
};
