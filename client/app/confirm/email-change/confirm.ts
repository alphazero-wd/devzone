import axios, { AxiosError } from "axios";
import { API_URL, UUID_REGEX } from "@/constants";
import { cookies } from "next/headers";

export const confirmEmailChange = async (
  token: string,
  emailType: "old" | "new"
) => {
  try {
    if (!token) return { error: { message: "Token is missing" } };
    if (!UUID_REGEX.test(token)) return { error: { message: "Invalid token" } };
    const { data } = await axios.post(
      API_URL + "/settings/account/email/confirm-change",
      {
        token,
        emailType,
      },
      { headers: { Cookie: cookies().toString() } }
    );
    return { success: true, message: data?.message as string };
  } catch (error: any) {
    return {
      success: false,
      message:
        error instanceof AxiosError
          ? error.response?.data.message
          : error.message,
    };
  }
};
