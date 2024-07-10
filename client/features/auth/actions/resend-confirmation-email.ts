import axios from "axios";
import { API_URL } from "@/constants";

export const resendConfirmationEmail = async () => {
  await axios.post(
    API_URL + "/auth/resend-confirmation",
    {},
    { withCredentials: true }
  );
};
