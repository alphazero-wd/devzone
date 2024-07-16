import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { ForgotPassword } from "./index";
import { Toaster } from "@/features/ui/toaster";
import { API_URL } from "@/constants";
import { server } from "@/mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("should display ForgotPassword form", async () => {
  const component = render(<ForgotPassword />);
  expect(component).toBeDefined();
});

describe("validation is not successful", () => {
  it("should show an error if email is empty", async () => {
    render(<ForgotPassword />);
    const sendResetPasswordEmailButton = screen.getByText(/send email/i);
    await userEvent.click(sendResetPasswordEmailButton);
    const emailErrorMessage = await screen.findByText(/email is empty/i);
    expect(emailErrorMessage).toBeInTheDocument();
  });
  it("should show an error if email is not valid", async () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByLabelText(/email/i);
    const sendResetPasswordEmailButton = screen.getByText(/send email/i);
    await userEvent.type(emailInput, "abc@a");
    await userEvent.click(sendResetPasswordEmailButton);
    const emailErrorMessage = await screen.findByText(
      /invalid email provided/i
    );
    expect(emailErrorMessage).toBeInTheDocument();
  });
});

describe("validation is successful", () => {
  it("should display loading and disable the button until response is received", async () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByLabelText(/email/i);
    const sendResetPasswordEmailButton = screen.getByText(/send email/i);
    await userEvent.type(emailInput, "bob@bob.com");
    await userEvent.click(sendResetPasswordEmailButton);
    expect(sendResetPasswordEmailButton).toHaveTextContent(/sending.../i);
    expect(sendResetPasswordEmailButton).toBeDisabled();
  });

  describe("and sending is not successful", () => {
    it("should display error alert if email does not exist", async () => {
      server.use(
        http.post(API_URL + "/auth/forgot-password", () => {
          return HttpResponse.json(
            { message: "Email does not exist" },
            { status: 400 }
          );
        })
      );
      render(<ForgotPassword />);
      const emailInput = screen.getByLabelText(/email/i);
      const sendResetPasswordEmailButton = screen.getByText(/send email/i);
      await userEvent.type(emailInput, "bob@bob.com");
      await userEvent.click(sendResetPasswordEmailButton);
      await waitFor(
        async () => {
          expect(
            await screen.findByText(/email does not exist/i)
          ).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("should display error alert if some unexpected error occur", async () => {
      server.use(
        http.post(API_URL + "/auth/forgot-password", () => {
          return HttpResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
          );
        })
      );
      render(
        <>
          <Toaster />
          <ForgotPassword />
        </>
      );
      const emailInput = screen.getByLabelText(/email/i);
      const sendResetPasswordEmailButton = screen.getByText(/send email/i);
      await userEvent.type(emailInput, "bob@bob.com");
      await userEvent.click(sendResetPasswordEmailButton);
      await waitFor(
        async () => {
          expect(
            await screen.findByText(/failed to send password reset email/i)
          ).toBeInTheDocument();
          const alertContent = await screen.findByText(/something went wrong/i);
          expect(alertContent).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe("and sending password reset email is successful", () => {
    it("should display info alert", async () => {
      render(
        <>
          <Toaster />
          <ForgotPassword />
        </>
      );
      const emailInput = screen.getByLabelText(/email/i);
      const sendResetPasswordEmailButton = screen.getByText(/send email/i);
      await userEvent.type(emailInput, "bob@bob.com");
      await userEvent.click(sendResetPasswordEmailButton);
      await waitFor(
        async () => {
          expect(
            await screen.findByText(/password reset email sent/i)
          ).toBeInTheDocument();
          expect(
            await screen.findByText(
              "Click on the link sent to bob@bob.com to reset your password"
            )
          ).toBeInTheDocument();
        },

        { timeout: 2000 }
      );
    });
  });
});

describe("when email has been sent", () => {
  it("should go back to changing email when clicking on the Change button", async () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByLabelText(/email/i);
    const sendResetPasswordEmailButton = screen.getByText(/send email/i);
    await userEvent.type(emailInput, "bob@bob.com");
    await userEvent.click(sendResetPasswordEmailButton);
    await waitFor(
      async () => {
        const goBackButton = await screen.findByRole("button", {
          name: /change/i,
        });
        expect(emailInput).not.toBeInTheDocument();
        expect(goBackButton).toBeInTheDocument();
        await userEvent.click(goBackButton);
        const changeEmailInput = await screen.findByLabelText(/email/i);
        expect(changeEmailInput).toBeInTheDocument();
        expect(changeEmailInput).toHaveValue("bob@bob.com");
      },
      { timeout: 2000 }
    );
  });
});
