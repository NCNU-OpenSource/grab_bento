import React from "react";
import {
  act,
  render as rtlrender,
  screen,
  fireEvent,
} from "@testing-library/react";
import SignIn from "../../SignIn";
import { AuthProvider } from "../../content/AuthContent";
import { SnackbarProvider } from "notistack";
import { auth } from "../../firebase";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

const setUpFirebaseAuthEmulator = () => {
  auth.useEmulator("http://localhost:9099");
  auth.createUserWithEmailAndPassword('test@test.com', 'test1234');
};

const render = (ui, { ...options } = {}) => {
  const history = createMemoryHistory();
  const wrapper = (props) => (
    <SnackbarProvider maxSnack={3} {...props}>
      <AuthProvider {...props}>
        <Router history={history} {...props}></Router>
      </AuthProvider>
    </SnackbarProvider>
  );
  rtlrender(ui, { wrapper: wrapper, ...options });
};

const setUp = () => {
  setUpFirebaseAuthEmulator();
};

beforeAll(() => setUp());

describe("Login", () => {
  test("login fail", async () => {
    render(<SignIn />);
    const form = await screen.findByTestId("SignInForm");
    expect(form).toBeInTheDocument();

    const [usernameInput, passwdInput, submitSignInBtn] = [
      screen.getByTestId("usernameInput"),
      screen.getByTestId("passwdInput"),
      screen.getByTestId("submitSignInBtn"),
    ];

    fireEvent.change(usernameInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwdInput, { target: { value: "test12312312314" } });
    submitSignInBtn.click();
    expect(await screen.findByText("Fail to Sign In.")).toBeInTheDocument();
  });

  test("login success", async () => {
    render(<SignIn />);
    const form = await screen.findByTestId("SignInForm");
    expect(form).toBeInTheDocument();

    const [usernameInput, passwdInput, submitSignInBtn] = [
      screen.getByTestId("usernameInput"),
      screen.getByTestId("passwdInput"),
      screen.getByTestId("submitSignInBtn"),
    ];

    fireEvent.change(usernameInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwdInput, { target: { value: "test1234" } });
    submitSignInBtn.click();
    expect(await screen.findByText("登入成功")).toBeInTheDocument();
  });
});
