import { render, screen } from "@testing-library/react";
import { UserMenu } from "./index";
import { User } from "../types";
import { server } from "@/mocks/server";
import { Toaster } from "@/features/ui/toaster";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";

const user: User = {
  id: 1,
  avatar: { id: 1, key: "test", url: "/" },
  email: "foo@bar.com",
  name: "Foo Bar",
  confirmedAt: new Date(),
  createdAt: new Date(),
};

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const getNextImageUrl = (url: string) =>
  "/_next/image?url=" + url.replaceAll("/", "%2F") + "&w=128&q=75";

it("should render component", () => {
  const component = render(<UserMenu user={user} />);
  expect(component).toBeDefined();
});

describe("testing avatar display", () => {
  it("should show the avatar", () => {
    render(<UserMenu user={user} />);
    expect(screen.getByAltText(`${user.name}'s avatar`)).toHaveAttribute(
      "src",
      getNextImageUrl(user.avatar!.url)
    );
  });

  it("should show the first letter of their name if no avatar is present", () => {
    render(<UserMenu user={{ ...user, avatar: null }} />);
    expect(screen.getByText(user.name[0])).toBeInTheDocument();
    expect(screen.queryByAltText(`${user.name}'s avatar`)).toBeNull();
  });
});

it("should show the dropdown when clicking on the avatar", async () => {
  render(<UserMenu user={user} />);
  await userEvent.click(screen.getByAltText(`${user.name}'s avatar`));
  expect(screen.getByRole("menu")).toBeInTheDocument();
});

describe("testing logout", () => {
  it("should show success alert upon successful logout", async () => {
    render(
      <>
        <Toaster />
        <UserMenu user={user} />
      </>
    );
    await userEvent.click(screen.getByAltText(`${user.name}'s avatar`));
    await userEvent.click(screen.getByRole("menuitem", { name: /log out/i }));
    expect(
      await screen.findByText(/log out successfully!/i)
    ).toBeInTheDocument();
  });

  it("should show error alert if some unexpected error occurs", async () => {
    server.use(
      http.post(API_URL + "/auth/logout", () =>
        HttpResponse.json({ message: "Something went wrong" }, { status: 500 })
      )
    );
    render(
      <>
        <Toaster />
        <UserMenu user={user} />
      </>
    );
    await userEvent.click(screen.getByAltText(`${user.name}'s avatar`));
    await userEvent.click(screen.getByRole("menuitem", { name: /log out/i }));
    expect(await screen.findByText("Log out failed!")).toBeInTheDocument();
    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
  });
});
