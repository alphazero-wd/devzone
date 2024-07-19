import { useToast } from "@/features/ui/use-toast";
import { logout } from "../actions/logout";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const { toast } = useToast();
  const router = useRouter();
  const onLogout = async () => {
    try {
      await logout();
      const { dismiss } = toast({
        variant: "success",
        title: "Log out successfully!",
      });
      setTimeout(dismiss, 2000);
      router.refresh();
    } catch (error: any) {
      const message = isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      const { dismiss } = toast({
        variant: "error",
        title: "Log out failed!",
        description: message,
      });
      setTimeout(dismiss, 2000);
    }
  };
  return onLogout;
};
