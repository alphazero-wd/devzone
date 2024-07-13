"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ConfirmEmailChangeClientProps {
  success: boolean;
}

export const ConfirmEmailChangeClient = ({
  success,
}: ConfirmEmailChangeClientProps) => {
  const router = useRouter();
  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        router.replace("/");
        router.refresh();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  });
  return null;
};
