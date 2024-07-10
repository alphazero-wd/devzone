import axios from "axios";
import { API_URL } from "@/constants";

export const logout = async () => {
  await axios.post(API_URL + "/auth/logout", {}, { withCredentials: true });
};
