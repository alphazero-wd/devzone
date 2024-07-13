import axios from "axios";
import { API_URL } from "@/constants";

export const initEmailChangeConfirmation = async () => {
  await axios.post(API_URL + "/settings/");
};
