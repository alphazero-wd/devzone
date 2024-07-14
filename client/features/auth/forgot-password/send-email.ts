import axios from "axios";
import { API_URL } from "@/constants";

export const sendResetPasswordEmail = async (email: string) => {
  await axios.post(API_URL + "/auth/forgot-password", { email });
};
