import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { PasswordSettingsForm } from "./form";
import { Toaster } from "@/features/ui/toaster";
import { API_URL } from "@/constants";
import { server } from "@/mocks/server";

const VALID_PASSWORD = "Abcd1234@";
const VALID_NEW_PASSWORD = "Abcd1234#";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("should display password settings form", async () => {
  const component = render(<PasswordSettingsForm />);
  expect(component).toBeDefined();
});

describe("validation is not successful", () => {
  it("should show errors if password, new password and confirm fields are required", async () => {
    render(<PasswordSettingsForm />);
    const updatePasswordButton = screen.getByRole("button", {
      name: /update/i,
    });
    await userEvent.click(updatePasswordButton);
    const currentPasswordErrorMessage = await screen.findByText(
      /current password is required/i
    );
    const newPasswordErrorMessage = await screen.findByText(
      "New password is required"
    );
    const confirmPasswordErrorMessage = await screen.findByText(
      /confirm new password is required/i
    );
    expect(currentPasswordErrorMessage).toBeInTheDocument();
    expect(newPasswordErrorMessage).toBeInTheDocument();
    expect(confirmPasswordErrorMessage).toBeInTheDocument();
  });

  it("should show an error if new password is not strong enough", async () => {
    render(<PasswordSettingsForm />);
    const updatePasswordButton = screen.getByRole("button", {
      name: /update/i,
    });
    await userEvent.type(screen.getByLabelText("New password"), "abcd1234");
    await userEvent.click(updatePasswordButton);
    expect(
      await screen.findByText(/new password is not strong enough/i)
    ).toBeInTheDocument();
  });

  it("should show an error if new password is the same as current one", async () => {
    render(<PasswordSettingsForm />);
    const updatePasswordButton = screen.getByRole("button", {
      name: /update/i,
    });
    await userEvent.type(
      screen.getByLabelText(/current password/i),
      VALID_PASSWORD
    );
    await userEvent.type(screen.getByLabelText("New password"), VALID_PASSWORD);
    await userEvent.click(updatePasswordButton);
    expect(
      await screen.findByText(
        /new password must be different from current password/i
      )
    ).toBeInTheDocument();
  });

  it("should show an error if passwords don't match", async () => {
    render(<PasswordSettingsForm />);
    const updatePasswordButton = screen.getByRole("button", {
      name: /update/i,
    });
    await userEvent.type(screen.getByLabelText("New password"), VALID_PASSWORD);
    await userEvent.type(
      screen.getByLabelText(/confirm new password/i),
      "Abcd1234#"
    );
    await userEvent.click(updatePasswordButton);
    expect(
      await screen.findByText(/passwords don't match/i)
    ).toBeInTheDocument();
  });
});

describe("validation is successful", () => {
  it("should display loading and disable the button until response is received", async () => {
    render(<PasswordSettingsForm />);
    const updatePasswordButton = screen.getByRole("button", {
      name: /update/i,
    });
    await userEvent.type(
      screen.getByLabelText(/current password/i),
      VALID_PASSWORD
    );
    await userEvent.type(
      screen.getByLabelText("New password"),
      VALID_NEW_PASSWORD
    );
    await userEvent.type(
      screen.getByLabelText(/confirm new password/i),
      VALID_NEW_PASSWORD
    );
    await userEvent.click(updatePasswordButton);
    expect(updatePasswordButton).toHaveTextContent("Updating...");
    expect(updatePasswordButton).toBeDisabled();
    await waitFor(
      () => {
        expect(updatePasswordButton).toHaveTextContent("Update");
        expect(updatePasswordButton).not.toBeDisabled();
      },
      { timeout: 2000 }
    );
  });

  describe("and updating password is not successful", () => {
    it("should display the form error if the current password is incorrect", async () => {
      server.use(
        http.patch(API_URL + "/settings/account/password", () => {
          return HttpResponse.json(
            { message: "Incorrect password provided" },
            { status: 400 }
          );
        })
      );
      render(<PasswordSettingsForm />);
      await userEvent.type(
        screen.getByLabelText(/current password/i),
        VALID_PASSWORD
      );
      await userEvent.type(
        screen.getByLabelText("New password"),
        VALID_NEW_PASSWORD
      );
      await userEvent.type(
        screen.getByLabelText(/confirm new password/i),
        VALID_NEW_PASSWORD
      );
      const updatePasswordButton = screen.getByRole("button", {
        name: /update/i,
      });
      await userEvent.click(updatePasswordButton);
      await waitFor(
        async () => {
          expect(
            await screen.findByText(/incorrect password provided/i)
          ).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("should display error alert if some unexpected error occur", async () => {
      server.use(
        http.patch(API_URL + "/settings/account/password", () => {
          return HttpResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
          );
        })
      );
      render(
        <>
          <Toaster />
          <PasswordSettingsForm />
        </>
      );
      await userEvent.type(
        screen.getByLabelText(/current password/i),
        VALID_PASSWORD
      );
      await userEvent.type(
        screen.getByLabelText("New password"),
        VALID_NEW_PASSWORD
      );
      await userEvent.type(
        screen.getByLabelText(/confirm new password/i),
        VALID_NEW_PASSWORD
      );
      const updatePasswordButton = screen.getByRole("button", {
        name: /update/i,
      });
      await userEvent.click(updatePasswordButton);
      await waitFor(
        async () => {
          expect(
            await screen.findByText(/failed to update password/i)
          ).toBeInTheDocument();
          expect(
            await screen.findByText(/something went wrong/i)
          ).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });
});

describe("and update password is successful", () => {
  it("should reset form if update password successfully", async () => {
    render(<PasswordSettingsForm />);
    const updatePasswordButton = screen.getByRole("button", {
      name: /update/i,
    });
    await userEvent.type(
      screen.getByLabelText(/current password/i),
      VALID_PASSWORD
    );
    await userEvent.type(
      screen.getByLabelText("New password"),
      VALID_NEW_PASSWORD
    );
    await userEvent.type(
      screen.getByLabelText(/confirm new password/i),
      VALID_NEW_PASSWORD
    );
    await userEvent.click(updatePasswordButton);
    await waitFor(
      () => {
        expect(screen.getByLabelText(/current password/i)).toHaveValue("");
        expect(screen.getByLabelText("New password")).toHaveValue("");
        expect(screen.getByLabelText(/confirm new password/i)).toHaveValue("");
      },
      { timeout: 2000 }
    );
  });

  it("should display success alert", async () => {
    render(
      <>
        <Toaster />
        <PasswordSettingsForm />
      </>
    );
    const updatePasswordButton = screen.getByRole("button", {
      name: /update/i,
    });
    await userEvent.type(
      screen.getByLabelText(/current password/i),
      VALID_PASSWORD
    );
    await userEvent.type(
      screen.getByLabelText("New password"),
      VALID_NEW_PASSWORD
    );
    await userEvent.type(
      screen.getByLabelText(/confirm new password/i),
      VALID_NEW_PASSWORD
    );
    await userEvent.click(updatePasswordButton);
    expect(
      await screen.findByText(/password updated successfully/i)
    ).toBeInTheDocument();
  });
});
