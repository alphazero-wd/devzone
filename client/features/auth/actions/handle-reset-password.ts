import axios from "axios";
import { API_URL } from "@/constants";

export const handleResetPassword = async (token: string, password: string) => {
  await axios.post(API_URL + "/auth/reset-password", { token, password });
};
