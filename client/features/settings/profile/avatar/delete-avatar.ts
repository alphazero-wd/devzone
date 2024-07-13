import axios from "axios";
import { API_URL } from "@/constants";

export const deleteAvatar = async () => {
  await axios.delete(API_URL + "/settings/profile/avatar/remove", {
    withCredentials: true,
  });
};
