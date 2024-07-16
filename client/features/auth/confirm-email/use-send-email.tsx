import { useToast } from "@/features/ui/use-toast";
import { useCallback } from "react";
import { resendConfirmationEmail } from "../actions/resend-confirmation-email";
import { isAxiosError } from "axios";

export const useSendConfirmationEmail = () => {
  const { toast } = useToast();

  const sendEmail = useCallback(async (email: string) => {
    try {
      await resendConfirmationEmail();
      toast({
        variant: "success",
        title: "Email sent successfully!",
        description: `Click on the link sent to ${email} to complete account confirmation`,
      });
    } catch (error: any) {
      toast({
        variant: "error",
        title: "Failed to send email",
        description: isAxiosError(error)
          ? error.response?.data.message
          : error.message,
      });
    }
  }, []);
  return sendEmail;
};
