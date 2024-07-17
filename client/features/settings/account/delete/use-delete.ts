import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useToast } from "@/features/ui/use-toast";
import { useRouter } from "next/navigation";
import { deleteAccount } from "./delete-account";
import { isAxiosError } from "axios";
import { timeout } from "@/features/common/utils";

const formSchema = z.object({
  password: z.string().min(1, { message: "Password is required" }),
});

export const useDeleteAccount = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const onSubmit = async ({ password }: z.infer<typeof formSchema>) => {
    setLoading(true);
    await timeout();
    try {
      await deleteAccount(password);
      toast({
        variant: "success",
        title: "Delete account successfully",
      });
      form.reset();
      router.replace("/");
      router.refresh();
    } catch (error: any) {
      if (isAxiosError(error) && error.response?.status === 400) {
        form.setError("password", { message: error.response.data.message });
      } else
        toast({
          variant: "error",
          title: "Failed to delete account",
          description: isAxiosError(error)
            ? error.response?.data.message
            : error?.message,
        });
    } finally {
      setLoading(false);
    }
  };
  return { loading, form, onSubmit, isDialogOpen, onDialogClose, onDialogOpen };
};
