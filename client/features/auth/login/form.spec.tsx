import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { LoginForm } from "./form";
import { Toaster } from "@/features/ui/toaster";
import { API_URL } from "@/constants";
import { server } from "@/mocks/server";

test("should display login form", async () => {
  const component = render(<LoginForm />);
  expect(component).toBeDefined();
});

describe("validation is not successful", () => {
  it("should show errors if email and password fields are empty", async () => {
    render(<LoginForm />);
    const loginButton = screen.getByText(/log in/i);
    await userEvent.click(loginButton);
    const emailErrorMessage = await screen.findByText(/email is empty/i);
    const passwordErrorMessage = await screen.findByText(/password is empty/i);
    expect(emailErrorMessage).toBeInTheDocument();
    expect(passwordErrorMessage).toBeInTheDocument();
  });

  it("should show an error if email is not valid", async () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const loginButton = screen.getByText(/log in/i);
    await userEvent.type(emailInput, "abc@a");
    await userEvent.click(loginButton);
    const emailErrorMessage = await screen.findByText(/email is invalid/i);
    expect(emailErrorMessage).toBeInTheDocument();
  });
});

describe("validation is successful", () => {
  it("should display loading and disable the button until response is received", async () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByText(/log in/i);
    await userEvent.type(emailInput, "bob@bob.com");
    await userEvent.type(passwordInput, "123");
    await userEvent.click(loginButton);
    expect(loginButton).toHaveTextContent(/logging in.../i);
    expect(loginButton).toBeDisabled();

    await waitFor(
      () => {
        expect(loginButton).toHaveTextContent(/log in/i);
        expect(loginButton).not.toBeDisabled();
      },
      { timeout: 2000 }
    );
  });

  describe("and log in is not successful", () => {
    it("should display error alert if email or password is incorrect", async () => {
      server.use(
        http.post(API_URL + "/auth/login", () => {
          return HttpResponse.json(
            { message: "Wrong email or password provided" },
            { status: 400 }
          );
        })
      );
      render(
        <>
          <Toaster />
          <LoginForm />
        </>
      );
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByText(/log in/i);
      await userEvent.type(emailInput, "bob@bob.com");
      await userEvent.type(passwordInput, "123");
      await userEvent.click(loginButton);
      await waitFor(
        async () => {
          expect(await screen.findByText(/login failed/i)).toBeInTheDocument();
          expect(
            await screen.findByText(/wrong email or password provided/i)
          ).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("should display error alert if some unexpected error occur", async () => {
      server.use(
        http.post(API_URL + "/auth/login", () => {
          return HttpResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
          );
        })
      );
      render(
        <>
          <Toaster />
          <LoginForm />
        </>
      );
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByText(/log in/i);
      await userEvent.type(emailInput, "bob@bob.com");
      await userEvent.type(passwordInput, "123");
      await userEvent.click(loginButton);
      expect(await screen.findByText(/login failed/i)).toBeInTheDocument();
      const alertContent = await screen.findByText(/something went wrong/i);
      expect(alertContent).toBeInTheDocument();
    });
  });

  describe("and login are successful", () => {
    it("should reset form if login successfully", async () => {
      render(<LoginForm />);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByText(/log in/i);
      await userEvent.type(emailInput, "bob@bob.com");
      await userEvent.type(passwordInput, "123");
      await userEvent.click(loginButton);

      await waitFor(
        () => {
          expect(emailInput).toHaveValue("");
          expect(passwordInput).toHaveValue("");
        },
        { timeout: 2000 }
      );
    });
    it("should display success alert", async () => {
      render(
        <>
          <Toaster />
          <LoginForm />
        </>
      );
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByText(/log in/i);
      await userEvent.type(emailInput, "bob@bob.com");
      await userEvent.type(passwordInput, "123");
      await userEvent.click(loginButton);
      expect(
        await screen.findByText(/login successfully!/i)
      ).toBeInTheDocument();
      expect(await screen.findByText(/welcome back, bob/i)).toBeInTheDocument();
    });
  });
});
