import axios from "axios";
import { API_URL } from "@/constants";

export const updatePassword = async (password: string, newPassword: string) => {
  await axios.patch(
    API_URL + "/settings/account/password",
    { password, newPassword },
    { withCredentials: true }
  );
};
