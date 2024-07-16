import { http, HttpResponse } from "msw";
import { API_URL } from "../constants";

export const handlers = [
  http.post(API_URL + "/auth/signup", () => HttpResponse.json({})),
  http.post(API_URL + "/auth/login", () =>
    HttpResponse.json({ name: "bob" }, { status: 200 })
  ),
  http.post(API_URL + "/auth/resend-confirmation", () => new HttpResponse()),
  http.post(API_URL + "/auth/forgot-password", () => new HttpResponse()),
  http.post(API_URL + "/auth/reset-password", () => new HttpResponse()),
];
