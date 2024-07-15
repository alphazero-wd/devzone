import { render, screen } from "@testing-library/react";
import { SignupForm } from "./form";
test("should render", () => {
  render(<SignupForm />);
  expect(
    screen.getByRole("button", { name: /create account/i })
  ).toBeInTheDocument();
});
