import axios, { AxiosError } from "axios";
import { API_URL } from "@/constants";
import { cookies } from "next/headers";

export const confirmEmailChange = async (
  token: string,
  emailType: "old" | "new"
) => {
  try {
    const { data } = await axios.post(
      API_URL + "/settings/account/email/confirm-change",
      {
        token,
        emailType,
      },
      { headers: { Cookie: cookies().toString() } }
    );
    console.log({ data });

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
