"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/features/ui/use-toast";
import { useEffect } from "react";

export const ConfirmEmailSuccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get("code") || searchParams.get("message")) {
      const { dismiss } = toast({
        variant: "success",
        title: "Email verified successfully",
        description: searchParams.get("message"),
      });
      setTimeout(() => {
        dismiss();
        router.push("/");
        router.refresh();
      }, 2000);
    }
  }, [searchParams.get("code"), searchParams.get("message")]);

  return null;
};
