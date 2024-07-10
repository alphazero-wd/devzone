import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useToast } from "@/features/ui/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  password: z.string().min(1, { message: "Password is required" }),
});

export const useDeleteAccount = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const onDialogOpen = () => setIsDialogOpen(true);
  const onDialogClose = () => {
    setIsDialogOpen(false);
    form.reset();
  };

  const validatePassword = async (password: string) => {
    const { error } = await supabase.rpc("validate_user_password", {
      plain_password: password,
    });
    return error;
  };
  const deleteAccount = async () => {
    const response = await fetch("/settings/account/delete", {
      method: "DELETE",
    });
    const { error } = await response.json();

    if (error)
      toast({
        variant: "error",
        title: "Delete account failed!",
        description: error.message,
      });
    else {
      toast({
        variant: "success",
        title: "Delete account successfully",
      });
      form.reset();
      router.replace("/");
      router.refresh();
    }
    setLoading(false);
  };

  const onSubmit = async ({ password }: z.infer<typeof formSchema>) => {
    setLoading(true);
    setTimeout(async () => {
      const error = await validatePassword(password);
      if (error) {
        form.setError("password", { message: error.message });
        setLoading(false);
        return;
      }
      await deleteAccount();
    }, 2000);
  };
  return { loading, form, onSubmit, isDialogOpen, onDialogClose, onDialogOpen };
};
