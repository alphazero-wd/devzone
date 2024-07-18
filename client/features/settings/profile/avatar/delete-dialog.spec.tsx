import { render, screen, waitFor } from "@testing-library/react";
import { DeleteAvatarDialog } from "./delete-dialog";
import userEvent from "@testing-library/user-event";
import { server } from "@/mocks/server";
import { Toaster } from "@/features/ui/toaster";
import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it("should render the component", () => {
  const component = render(<DeleteAvatarDialog />);
  expect(component).toBeDefined();
});

it("should open the dialog", async () => {
  render(<DeleteAvatarDialog />);
  await userEvent.click(screen.getByRole("button", { name: /remove/i }));
  expect(await screen.findByRole("dialog")).toBeInTheDocument();
});

it("should close the dialog when the Cancel button is clicked", async () => {
  render(<DeleteAvatarDialog />);
  await userEvent.click(screen.getByRole("button", { name: /remove/i }));
  await userEvent.click(await screen.findByRole("button", { name: /cancel/i }));
  expect(screen.queryByRole("dialog")).toBeNull();
});

describe("when the Continue button is clicked", () => {
  it("should display loading state and stop later regardless", async () => {
    render(
      <>
        <Toaster />
        <DeleteAvatarDialog />
      </>
    );
    await userEvent.click(screen.getByRole("button", { name: /remove/i }));
    const cancelButton = await screen.findByRole("button", { name: /cancel/i });
    const continueButton = await screen.findByRole("button", {
      name: /continue/i,
    });
    await userEvent.click(continueButton);
    expect(cancelButton).toBeDisabled();
    expect(continueButton).toHaveTextContent("Deleting...");
    expect(continueButton).toBeDisabled();
    await waitFor(
      async () => {
        expect(cancelButton).not.toBeDisabled();
        expect(continueButton).toHaveTextContent("Continue");
        expect(continueButton).not.toBeDisabled();
      },
      { timeout: 2000 }
    );
  });
  it("should show success alert if avatar is removed", async () => {
    render(
      <>
        <Toaster />
        <DeleteAvatarDialog />
      </>
    );
    await userEvent.click(screen.getByRole("button", { name: /remove/i }));
    await userEvent.click(
      await screen.findByRole("button", { name: /continue/i })
    );
    await waitFor(
      async () => {
        expect(
          await screen.findByText(/delete avatar successfully!/i)
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it("should show error alert if failed to remove avatar", async () => {
    server.use(
      http.delete(API_URL + "/settings/profile/avatar/remove", () =>
        HttpResponse.json({ message: "Something went wrong" }, { status: 500 })
      )
    );
    render(
      <>
        <Toaster />
        <DeleteAvatarDialog />
      </>
    );
    await userEvent.click(screen.getByRole("button", { name: /remove/i }));
    await userEvent.click(
      await screen.findByRole("button", { name: /continue/i })
    );
    await waitFor(
      async () => {
        expect(
          await screen.findByText(/delete avatar failed!/i)
        ).toBeInTheDocument();
        expect(
          await screen.findByText(/something went wrong/i)
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
