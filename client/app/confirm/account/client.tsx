"use client";

import { useRouter } from "next/router";
import { useEffect } from "react";

interface ConfirmAccountClientProps {
  success: boolean;
}

export const ConfirmAccountClient = ({
  success,
}: ConfirmAccountClientProps) => {
  const router = useRouter();
  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        router.replace("/");
        router.reload();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  });
  return null;
};
