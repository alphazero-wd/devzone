import axios from "axios";
import { cookies } from "next/headers";
import { User } from "../types";
import { API_URL } from "@/constants";

export const getUser = async () => {
  try {
    const config =
      typeof window === "undefined"
        ? {
            headers: { Cookie: cookies().toString() },
          }
        : { withCredentials: true };
    const { data } = await axios.get(API_URL + "/auth/me", config);
    return data as User;
  } catch (error) {
    return null;
  }
};
