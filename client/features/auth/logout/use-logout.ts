import { useToast } from "@/features/ui/use-toast";
import { logout } from "../actions/logout";

export const useLogout = () => {
  const { toast } = useToast();
  const onLogout = async () => {
    await logout();
    const { dismiss } = toast({
      variant: "success",
      title: "Sign out successfully!",
    });
    setTimeout(() => {
      dismiss();
      location.reload();
    }, 2000);
  };
  return onLogout;
};
