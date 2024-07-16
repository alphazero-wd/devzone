import { SignupForm } from "./form";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { server } from "@/mocks/server";
import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { Toaster } from "@/features/ui/toaster";

test("should render", () => {
  render(<SignupForm />);
  expect(
    screen.getByRole("button", { name: /create account/i })
  ).toBeInTheDocument();
});

describe("validation is not successful", () => {
  it("should show errors if name, email and password fields are empty", async () => {
    render(<SignupForm />);
    const signupButton = screen.getByText(/create account/i);
    await userEvent.click(signupButton);
    const nameErrorMessage = await screen.findByText(/name is empty/i);
    const emailErrorMessage = await screen.findByText(/email is empty/i);
    const passwordErrorMessage = await screen.findByText(
      /password is too short/i
    );
    expect(nameErrorMessage).toBeInTheDocument();
    expect(emailErrorMessage).toBeInTheDocument();
    expect(passwordErrorMessage).toBeInTheDocument();
  });

  describe("and name is not valid", () => {
    it("should show an error if name is too long", async () => {
      render(<SignupForm />);
      const nameInput = screen.getByLabelText(/your name/i);
      const signupButton = screen.getByText(/create account/i);
      await userEvent.type(nameInput, "a".repeat(31));
      await userEvent.click(signupButton);
      const nameErrorMessage = await screen.findByText(/name is too long/i);
      expect(nameErrorMessage).toBeInTheDocument();
    });
  });

  describe("and email is not valid", () => {
    it("should show an error if email is not valid", async () => {
      render(<SignupForm />);
      const emailInput = screen.getByLabelText(/email/i);
      const signupButton = screen.getByText(/create account/i);
      await userEvent.type(emailInput, "abc@a");
      await userEvent.click(signupButton);
      const emailErrorMessage = await screen.findByText(/email is invalid/i);
      expect(emailErrorMessage).toBeInTheDocument();
    });
  });

  describe("and password is not valid", () => {
    it("should show an error if password is too weak", async () => {
      render(<SignupForm />);
      const passwordInput = screen.getByLabelText(/password/i);
      const signupButton = screen.getByText(/create account/i);
      await userEvent.type(passwordInput, "abcd1234");
      await userEvent.click(signupButton);
      const passwordErrorMessage = await screen.findByText(
        /password is not strong enough/i
      );
      expect(passwordErrorMessage).toBeInTheDocument();
    });
  });
});

describe("validation is successful", () => {
  it("should display loading state upon signup", async () => {
    render(<SignupForm />);
    const signupButton = screen.getByText(/create account/i);
    await userEvent.type(screen.getByLabelText(/your name/i), "bob");
    await userEvent.type(screen.getByLabelText(/email/i), "bob@bob.com");
    await userEvent.type(screen.getByLabelText(/password/i), "Bob123@");
    await userEvent.click(signupButton);
    await waitFor(() => {
      expect(signupButton).toHaveTextContent(/creating account.../i);
      expect(screen.getByLabelText(/your name/i)).toBeDisabled();
      expect(screen.getByLabelText(/email/i)).toBeDisabled();
      expect(screen.getByLabelText(/password/i)).toBeDisabled();
      expect(signupButton).toBeDisabled();
    });
  });

  it("should show error and stop loading if email already exists", async () => {
    server.use(
      http.post(API_URL + "/auth/signup", () =>
        HttpResponse.json({ message: "Email already exists" }, { status: 400 })
      )
    );
    render(<SignupForm />);
    const signupButton = screen.getByText(/create account/i);
    await userEvent.type(screen.getByLabelText(/your name/i), "bob");
    await userEvent.type(screen.getByLabelText(/email/i), "bob@bob.com");
    await userEvent.type(screen.getByLabelText(/password/i), "Bob123@");
    await userEvent.click(signupButton);
    await waitFor(
      async () => {
        expect(
          await screen.findByText(/email already exists/i)
        ).toBeInTheDocument();
        expect(signupButton).toHaveTextContent(/create account/i);
        expect(screen.getByLabelText(/your name/i)).not.toBeDisabled();
        expect(screen.getByLabelText(/email/i)).not.toBeDisabled();
        expect(screen.getByLabelText(/password/i)).not.toBeDisabled();
        expect(signupButton).not.toBeDisabled();
      },
      { timeout: 2000 }
    );
  });

  it("should display alert, stop loading and reset form when signing up successfully", async () => {
    const components = (
      <>
        <Toaster />
        <SignupForm />
      </>
    );
    render(components);
    const nameInput = screen.getByLabelText(/your name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signupButton = screen.getByText(/create account/i);
    await userEvent.type(nameInput, "bob");
    await userEvent.type(emailInput, "bob@bob.com");
    await userEvent.type(passwordInput, "Bob123@");
    await userEvent.click(signupButton);
    await waitFor(
      () => {
        expect(nameInput).toHaveValue("");
        expect(emailInput).toHaveValue("");
        expect(passwordInput).toHaveValue("");
        expect(nameInput).not.toBeDisabled();
        expect(emailInput).not.toBeDisabled();
        expect(passwordInput).not.toBeDisabled();
        expect(signupButton).toHaveTextContent(/create account/i);
        expect(signupButton).not.toBeDisabled();
      },
      { timeout: 2000 }
    );
    expect(await screen.findByText(/confirm your email/i)).toBeInTheDocument();
    expect(
      await screen.findByText(
        "An email has been sent to bob@bob.com. Click on the link to confirm."
      )
    ).toBeInTheDocument();
  });
});
