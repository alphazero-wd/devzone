import { http, HttpResponse } from "msw";
import { API_URL } from "../constants";

export const handlers = [
  http.post(API_URL + "/auth/signup", () => HttpResponse.json({})),
  http.post(API_URL + "/auth/login", () =>
    HttpResponse.json({}, { status: 200 })
  ),
];
