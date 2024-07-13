import axios from "axios";
import { API_URL } from "@/constants";

export const deleteAccount = async (confirmPassword: string) => {
  await axios.delete(`${API_URL}/settings/account/delete`, {
    data: { password: confirmPassword },
    withCredentials: true,
  });
};
