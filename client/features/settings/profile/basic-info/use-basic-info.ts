import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/features/ui/use-toast";
import { NAME_MAX_LENGTH } from "@/constants";
import { useRouter } from "next/navigation";

interface BasicInfoFormParams {
  profileId: string;
  firstName: string;
  lastName: string;
}

const formSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(NAME_MAX_LENGTH, {
      message: "First name is too long",
    }),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(NAME_MAX_LENGTH, {
      message: "Last name is too long",
    }),
});

export const useBasicInfoForm = ({
  profileId,
  firstName,
  lastName,
}: BasicInfoFormParams) => {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    form.setValue("firstName", firstName);
    form.setValue("lastName", lastName);
  }, [firstName, lastName]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setTimeout(() => update(values), 2000);
  };
  const update = async (values: z.infer<typeof formSchema>) => {
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: values.firstName,
        last_name: values.lastName,
      })
      .eq("user_id", profileId);
    if (error)
      toast({
        variant: "error",
        title: "Failed to update profile",
        description: error.message,
      });
    else {
      toast({ variant: "success", title: "Profile updated successfully" });
      router.refresh();
    }
    setLoading(false);
  };

  const cancelChanges = () => {
    form.setValue("firstName", firstName);
    form.setValue("lastName", lastName);
    toast({
      variant: "info",
      title: "Changes to your names have been cancelled",
    });
  };

  return {
    loading,
    onSubmit,
    form,
    cancelChanges,
  };
};
