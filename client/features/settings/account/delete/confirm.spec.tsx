import { render, screen, waitFor } from "@testing-library/react";
import { ConfirmDeleteDialog } from "./confirm";
import userEvent from "@testing-library/user-event";
import { Toaster } from "@/features/ui/toaster";
import { server } from "@/mocks/server";
import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it("should render component", () => {
  const component = render(<ConfirmDeleteDialog />);
  expect(component).toBeDefined();
});

it("should show the confirmation dialog when the delete account button is clicked", async () => {
  render(<ConfirmDeleteDialog />);
  const deleteAccountButton = screen.getByRole("button", {
    name: /delete account/i,
  });
  await userEvent.click(deleteAccountButton);
  expect(await screen.findByRole("dialog")).toBeInTheDocument();
});

it("should close the dialog when the Cancel button is clicked", async () => {
  render(<ConfirmDeleteDialog />);
  const deleteAccountButton = screen.getByRole("button", {
    name: /delete account/i,
  });
  await userEvent.click(deleteAccountButton);
  await userEvent.click(await screen.findByRole("button", { name: /cancel/i }));
  expect(screen.queryByRole("dialog")).toBeNull();
});

describe("when filling in the confirmation password", () => {
  beforeEach(async () => {
    render(<ConfirmDeleteDialog />);
    const deleteAccountButton = screen.getByRole("button", {
      name: /delete account/i,
    });
    await userEvent.click(deleteAccountButton);
  });

  it("should show a form error if password is empty", async () => {
    await userEvent.click(
      await screen.findByRole("button", {
        name: /continue/i,
      })
    );
    expect(
      await screen.findByText(/password is required/i)
    ).toBeInTheDocument();
  });

  it("should show a form error if password is incorrect", async () => {
    server.use(
      http.delete(API_URL + "/settings/account/delete", () =>
        HttpResponse.json(
          { message: "Incorrect password provided" },
          { status: 400 }
        )
      )
    );
    const passwordInput = await screen.findByLabelText(
      /to confirm, type in your password/i
    );
    await userEvent.type(passwordInput, "bob");
    await userEvent.click(
      await screen.findByRole("button", {
        name: /continue/i,
      })
    );
    await waitFor(
      async () => {
        expect(
          await screen.findByText(/incorrect password provided/i)
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});

describe("when the confirmation password is correct", () => {
  beforeEach(async () => {
    render(
      <>
        <Toaster />
        <ConfirmDeleteDialog />
      </>
    );
    const deleteAccountButton = screen.getByRole("button", {
      name: /delete account/i,
    });
    await userEvent.click(deleteAccountButton);
  });

  it("should show the loading and stop later regardless", async () => {
    const cancelButton = await screen.findByRole("button", {
      name: /cancel/i,
    });
    const continueButton = await screen.findByRole("button", {
      name: /continue/i,
    });
    const passwordInput = await screen.findByLabelText(
      /to confirm, type in your password/i
    );
    await userEvent.type(passwordInput, "bob");
    await userEvent.click(continueButton);
    expect(continueButton).toHaveTextContent("Deleting...");
    expect(cancelButton).toBeDisabled();
    expect(continueButton).toBeDisabled();
    await waitFor(
      () => {
        expect(continueButton).toHaveTextContent("Continue");
        expect(cancelButton).not.toBeDisabled();
        expect(continueButton).not.toBeDisabled();
      },
      { timeout: 2000 }
    );
  });

  it("should show an error alert when something goes wrong", async () => {
    server.use(
      http.delete(API_URL + "/settings/account/delete", () =>
        HttpResponse.json({ message: "Something went wrong" }, { status: 500 })
      )
    );
    const passwordInput = await screen.findByLabelText(
      /to confirm, type in your password/i
    );
    await userEvent.type(passwordInput, "bob");
    await userEvent.click(
      await screen.findByRole("button", {
        name: /continue/i,
      })
    );
    await waitFor(
      async () => {
        expect(
          await screen.findByText(/something went wrong/i)
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it("should show a success alert when the account is deleted", async () => {
    const passwordInput = await screen.findByLabelText(
      /to confirm, type in your password/i
    );
    await userEvent.type(passwordInput, "bob");
    await userEvent.click(
      await screen.findByRole("button", {
        name: /continue/i,
      })
    );

    await waitFor(
      async () => {
        expect(
          await screen.findByText(/delete account successfully/i)
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
