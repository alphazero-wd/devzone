import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/features/ui/use-toast";
import { NAME_MAX_LENGTH } from "@/constants";
import { useRouter } from "next/navigation";
import { updateName } from "./update-name";
import { isAxiosError } from "axios";
import { timeout } from "@/features/common/utils";

interface BasicInfoFormParams {
  name: string;
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(NAME_MAX_LENGTH, {
      message: "Name is too long",
    }),
});

export const useBasicInfoForm = ({ name }: BasicInfoFormParams) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    form.setValue("name", name);
  }, [name]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    await timeout();
    await update(values);
  };
  const update = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateName(values.name);
      const { dismiss } = toast({
        variant: "success",
        title: "Updated your name successfully",
      });
      setTimeout(dismiss, 2000);
      router.refresh();
    } catch (error: any) {
      const { dismiss } = toast({
        variant: "error",
        title: "Failed to update name",
        description: isAxiosError(error)
          ? error.response?.data.message
          : error.message,
      });
      setTimeout(dismiss, 2000);
    } finally {
      setLoading(false);
    }
  };

  const cancelChanges = () => {
    form.setValue("name", name);
    toast({
      variant: "info",
      title: "Changes cancelled",
    });
  };

  return {
    loading,
    onSubmit,
    form,
    cancelChanges,
  };
};
