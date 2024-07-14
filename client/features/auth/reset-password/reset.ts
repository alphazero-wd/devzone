import axios from "axios";
import { API_URL } from "@/constants";

export const resetPassword = async (password: string, token: string) => {
  await axios.post(API_URL + "/auth/reset-password", { password, token });
};
