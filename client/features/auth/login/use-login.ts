import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/features/ui/use-toast";
import { login } from "../actions/login";
import { AxiosError } from "axios";
import { timeout } from "@/features/common/utils";

const formSchema = z.object({
  email: z.string().min(1, { message: "Email is empty" }).email({
    message: "Email is invalid",
  }),
  password: z.string().min(1, { message: "Password is empty." }),
});

export const useLogin = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      const user = await login(values);

      const { dismiss } = toast({
        variant: "success",
        title: "Login successfully!",
        description: `Welcome back, ${user.name} :)`,
      });
      setTimeout(dismiss, 2000);
      form.reset();
      router.replace("/");
      router.refresh();
    } catch (error: any) {
      const message =
        error instanceof AxiosError
          ? error.response?.data.message
          : error.message;
      toast({
        variant: "error",
        title: "Login failed!",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }
  return { form, onSubmit, loading };
};
