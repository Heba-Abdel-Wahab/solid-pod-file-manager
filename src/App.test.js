import { render, screen } from "@testing-library/react";
import { SessionProvider } from "@inrupt/solid-ui-react";
import App from "./App";

jest.mock("@inrupt/solid-client-authn-browser", () => ({
  handleIncomingRedirect: jest.fn(() => Promise.resolve()),
  login: jest.fn(),
  logout: jest.fn(),
}));

test("renders the Solid Pod Browser heading", () => {
  render(
    <SessionProvider>
      <App />
    </SessionProvider>
  );

  expect(screen.getByRole("heading", { name: /solid pod browser/i })).toBeInTheDocument();
});
