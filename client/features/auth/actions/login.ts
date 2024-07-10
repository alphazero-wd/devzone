import axios from "axios";
import { User } from "@/features/users/types";
import { API_URL } from "@/constants";

interface LoginPayload {
  email: string;
  password: string;
}

export const login = async (payload: LoginPayload) => {
  const { data } = await axios.post(API_URL + "/auth/login", payload, {
    withCredentials: true,
  });
  return data as User;
};
