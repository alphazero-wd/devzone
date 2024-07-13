import axios from "axios";
import { API_URL } from "@/constants";

export const initEmailChangeConfirmation = async (newEmail: string) => {
  await axios.patch(
    API_URL + "/settings/account/email",
    { email: newEmail },
    { withCredentials: true }
  );
};
