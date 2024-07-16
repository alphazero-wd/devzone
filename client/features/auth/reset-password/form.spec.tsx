import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { ResetPasswordForm } from "./form";
import { Toaster } from "@/features/ui/toaster";
import { API_URL } from "@/constants";
import { server } from "@/mocks/server";

const VALID_PASSWORD = "Abcd1234@";
const VALID_TOKEN = "71b55e73-232a-4673-b3da-314927c821db";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("should display reset password form", async () => {
  const component = render(<ResetPasswordForm />);
  expect(component).toBeDefined();
});

describe("validation is not successful", () => {
  it("should show errors if password and confirm fields are empty", async () => {
    render(<ResetPasswordForm />);
    const resetPasswordButton = screen.getByText("Reset password");
    await userEvent.click(resetPasswordButton);
    const passwordErrorMessage = await screen.findByText(
      /password is too short/i
    );
    const confirmPasswordErrorMessage = await screen.findByText(
      /confirm password is empty/i
    );
    expect(passwordErrorMessage).toBeInTheDocument();
    expect(confirmPasswordErrorMessage).toBeInTheDocument();
  });

  it("should show an error if password is not strong enough", async () => {
    render(<ResetPasswordForm />);
    const resetPasswordButton = screen.getByText("Reset password");
    await userEvent.type(screen.getByLabelText("Password"), "abcd1234");
    await userEvent.click(resetPasswordButton);
    expect(
      await screen.findByText(/password is not strong enough/i)
    ).toBeInTheDocument();
  });

  it("should show an error if passwords don't match", async () => {
    render(<ResetPasswordForm />);
    const resetPasswordButton = screen.getByText("Reset password");
    await userEvent.type(screen.getByLabelText("Password"), VALID_PASSWORD);
    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      "Abcd1234#"
    );
    await userEvent.click(resetPasswordButton);
    expect(
      await screen.findByText(/passwords don't match/i)
    ).toBeInTheDocument();
  });
});

describe("validation is successful", () => {
  it("should display loading and disable the button until response is received", async () => {
    render(<ResetPasswordForm />);
    const resetPasswordButton = screen.getByText("Reset password");
    await userEvent.type(screen.getByLabelText("Password"), VALID_PASSWORD);
    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      VALID_PASSWORD
    );
    await userEvent.click(resetPasswordButton);
    expect(resetPasswordButton).toHaveTextContent("");
    expect(resetPasswordButton).toBeDisabled();
    await waitFor(
      () => {
        expect(resetPasswordButton).toHaveTextContent("Reset password");
        expect(resetPasswordButton).not.toBeDisabled();
      },
      { timeout: 2000 }
    );
  });

  describe("and reset password is not successful", () => {
    describe("and provided token is invalid", () => {
      it("should display error alert if token is missing", async () => {
        render(
          <>
            <Toaster />
            <ResetPasswordForm />
          </>
        );
        await userEvent.type(screen.getByLabelText("Password"), VALID_PASSWORD);
        await userEvent.type(
          screen.getByLabelText(/confirm password/i),
          VALID_PASSWORD
        );
        const resetPasswordButton = screen.getByText("Reset password");
        await userEvent.click(resetPasswordButton);
        expect(
          await screen.findByText(/failed to reset password/i)
        ).toBeInTheDocument();
        expect(
          await screen.findByText(/token is missing/i)
        ).toBeInTheDocument();
      });

      it("should display error alert if token is not in the right format", async () => {
        render(
          <>
            <Toaster />
            <ResetPasswordForm token="invalid-token" />
          </>
        );
        await userEvent.type(screen.getByLabelText("Password"), VALID_PASSWORD);
        await userEvent.type(
          screen.getByLabelText(/confirm password/i),
          VALID_PASSWORD
        );
        const resetPasswordButton = screen.getByText("Reset password");
        await userEvent.click(resetPasswordButton);
        expect(
          await screen.findByText(/failed to reset password/i)
        ).toBeInTheDocument();
        expect(
          await screen.findByText(/token is not correctly formatted/i)
        ).toBeInTheDocument();
      });
    });

    describe("and the provided token is valid", () => {
      it("should display error alert if the provided token is invalid (not found/expired)", async () => {
        server.use(
          http.post(API_URL + "/auth/reset-password", () => {
            return HttpResponse.json(
              { message: "Invalid token provided" },
              { status: 400 }
            );
          })
        );
        render(
          <>
            <Toaster />
            <ResetPasswordForm token={VALID_TOKEN} />
          </>
        );
        await userEvent.type(screen.getByLabelText("Password"), VALID_PASSWORD);
        await userEvent.type(
          screen.getByLabelText(/confirm password/i),
          VALID_PASSWORD
        );
        const resetPasswordButton = screen.getByText("Reset password");
        await userEvent.click(resetPasswordButton);
        expect(
          await screen.findByText(/failed to reset password/i)
        ).toBeInTheDocument();
        expect(
          await screen.findByText(/invalid token provided/i)
        ).toBeInTheDocument();
      });

      it("should display error alert if some unexpected error occur", async () => {
        server.use(
          http.post(API_URL + "/auth/reset-password", () => {
            return HttpResponse.json(
              { message: "Something went wrong" },
              { status: 500 }
            );
          })
        );
        render(
          <>
            <Toaster />
            <ResetPasswordForm token={VALID_TOKEN} />
          </>
        );
        await userEvent.type(screen.getByLabelText("Password"), VALID_PASSWORD);
        await userEvent.type(
          screen.getByLabelText(/confirm password/i),
          VALID_PASSWORD
        );
        const resetPasswordButton = screen.getByText("Reset password");
        await userEvent.click(resetPasswordButton);
        expect(
          await screen.findByText(/failed to reset password/i)
        ).toBeInTheDocument();
        expect(
          await screen.findByText(/something went wrong/i)
        ).toBeInTheDocument();
      });
    });
  });
  describe("and reset password is successful", () => {
    it("should reset form if reset password successfully", async () => {
      render(<ResetPasswordForm token={VALID_TOKEN} />);
      const resetPasswordButton = screen.getByText("Reset password");
      await userEvent.type(screen.getByLabelText("Password"), VALID_PASSWORD);
      await userEvent.type(
        screen.getByLabelText(/confirm password/i),
        VALID_PASSWORD
      );
      await userEvent.click(resetPasswordButton);
      await waitFor(
        () => {
          expect(screen.getByLabelText("Password")).toHaveValue("");
          expect(screen.getByLabelText(/confirm password/i)).toHaveValue("");
        },
        { timeout: 2000 }
      );
    });
    it("should display success alert", async () => {
      render(
        <>
          <Toaster />
          <ResetPasswordForm token={VALID_TOKEN} />
        </>
      );
      const resetPasswordButton = screen.getByText("Reset password");
      await userEvent.type(screen.getByLabelText("Password"), VALID_PASSWORD);
      await userEvent.type(
        screen.getByLabelText(/confirm password/i),
        VALID_PASSWORD
      );
      await userEvent.click(resetPasswordButton);
      expect(
        await screen.findByText(/password reset successfully/i)
      ).toBeInTheDocument();
      expect(
        await screen.findByText(/now log in again with your new password/i)
      ).toBeInTheDocument();
    });
  });
});
