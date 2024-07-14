import axios from "axios";
import { API_URL, UUID_REGEX } from "@/constants";
import { cookies } from "next/headers";

interface ConfirmEmailResponse {
  error: { message: string };
}

export const confirmEmail = async (
  token?: string
): Promise<ConfirmEmailResponse | undefined> => {
  try {
    if (!token) return { error: { message: "Token is missing" } };
    if (!UUID_REGEX.test(token)) return { error: { message: "Invalid token" } };
    await axios.post(
      API_URL + "/auth/confirm-email",
      { token },
      { headers: { Cookie: cookies().toString() } }
    );
  } catch (error: any) {
    return { error: { message: error.response.data.message } };
  }
};
