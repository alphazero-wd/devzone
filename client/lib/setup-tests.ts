import "@testing-library/jest-dom";

process.env = { ...process.env, NODE_ENV: "test" };
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: () => null,
      replace: () => null,
      refresh: () => null,
    };
  },
}));
