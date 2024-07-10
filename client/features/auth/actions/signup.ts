import axios from "axios";
import { User } from "@/features/users/types";
import { API_URL } from "@/constants";

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export const signUp = async (payload: SignUpPayload) => {
  const { data } = await axios.post(API_URL + "/auth/signup", payload);
  return data as User;
};
