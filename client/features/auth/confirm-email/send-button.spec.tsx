import { render, screen, waitFor } from "@testing-library/react";
import { SendEmailButton } from "./send-button";
import { Toaster } from "@/features/ui/toaster";
import userEvent from "@testing-library/user-event";
import { server } from "@/mocks/server";
import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";

const FAKE_EMAIL = "foo@bar.com";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("should render send button", () => {
  const component = render(<SendEmailButton email={FAKE_EMAIL} />);
  expect(component).toBeDefined();
});

test("should show success alert if email is sent successfully", async () => {
  render(
    <>
      <Toaster />
      <SendEmailButton email={FAKE_EMAIL} />
    </>
  );
  const button = screen.getByRole("button", { name: /send email/i });
  await userEvent.click(button);
  await waitFor(
    async () => {
      expect(await screen.findByText(/email sent successfully/i));
      expect(
        await screen.findByText(
          `Click on the link sent to ${FAKE_EMAIL} to complete account confirmation`
        )
      );
    },
    { timeout: 2000 }
  );
});

test("should show error alert if failed to send email", async () => {
  server.use(
    http.post(API_URL + "/auth/resend-confirmation", () =>
      HttpResponse.json(
        {
          message: "Something went wrong",
        },
        { status: 500 }
      )
    )
  );
  render(
    <>
      <Toaster />
      <SendEmailButton email={FAKE_EMAIL} />
    </>
  );
  const button = screen.getByRole("button", { name: /send email/i });
  await userEvent.click(button);
  await waitFor(
    async () => {
      expect(await screen.findByText(/failed to send email/i));
      expect(await screen.findByText(/something went wrong/i));
    },
    { timeout: 2000 }
  );
});
