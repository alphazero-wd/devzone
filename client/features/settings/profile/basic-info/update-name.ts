import axios from "axios";
import { API_URL } from "@/constants";

export const updateName = async (newName: string) => {
  await axios.patch(
    API_URL + "/settings/profile/name",
    { name: newName },
    { withCredentials: true }
  );
};
