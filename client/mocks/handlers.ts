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
  http.post(API_URL + "/auth/logout", () => new HttpResponse()),
  http.patch(API_URL + "/settings/profile/name", () => new HttpResponse()),
  http.patch(API_URL + "/settings/account/email", () => new HttpResponse()),
  http.patch(API_URL + "/settings/account/password", () => new HttpResponse()),
  http.delete(API_URL + "/settings/account/delete", () => new HttpResponse()),
  http.delete(
    API_URL + "/settings/profile/avatar/remove",
    () => new HttpResponse()
  ),
  http.patch(API_URL + "/settings/profile/avatar", () => new HttpResponse()),
];
