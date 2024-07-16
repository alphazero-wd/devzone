import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/features/ui/use-toast";
import { NAME_MAX_LENGTH, PASSWORD_REGEX } from "@/constants";
import { signUp } from "../actions/signup";
import { login } from "../actions/login";
import { isAxiosError } from "axios";
import { timeout } from "@/features/common/utils";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is empty" }).max(NAME_MAX_LENGTH, {
    message: "Name is too long",
  }),
  email: z.string().min(1, { message: "Email is empty" }).email({
    message: "Email is invalid",
  }),
  password: z
    .string()
    .min(6, { message: "Password is too short" })
    .regex(PASSWORD_REGEX, {
      message: "Password is not strong enough",
    }),
});

export const useSignup = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    await timeout();
    try {
      await signUp(values);
      await login({ email: values.email, password: values.password });
      const { dismiss } = toast({
        variant: "info",
        title: "Confirm your email",
        description: `An email has been sent to ${values.email}. Click on the link to confirm.`,
      });

      setTimeout(dismiss, 2000);
      form.reset();
      router.replace("/confirm/required");
      router.refresh();
    } catch (error: any) {
      if (isAxiosError(error) && error.response?.status === 400) {
        form.setError("email", { message: error.response.data.message });
      } else {
        const message = isAxiosError(error)
          ? error.response?.data.message
          : error.message;
        const { dismiss } = toast({
          variant: "error",
          title: "Sign up error!",
          description: message,
        });
        setTimeout(dismiss, 2000);
      }
    } finally {
      setLoading(false);
    }
  }
  return { form, onSubmit, loading };
};
