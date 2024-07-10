"use client";
import { Button } from "@/features/ui/button";
import { useSendConfirmationEmail } from "./use-send-email";

interface SendEmailButtonProps {
  email: string;
}

export const SendEmailButton = ({ email }: SendEmailButtonProps) => {
  const sendEmail = useSendConfirmationEmail();
  return (
    <Button className="w-fit mx-auto" onClick={() => sendEmail(email)}>
      Send email
    </Button>
  );
};
