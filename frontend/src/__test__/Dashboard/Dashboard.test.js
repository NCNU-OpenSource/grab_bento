import React from "react";
import {
  fireEvent,
  render as rtlrender,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "../../Dashboard/DataTable";
import "@testing-library/jest-dom/extend-expect";
import { rest } from "msw";
import { setupServer } from "msw/node";

import { localUrl, serverURL } from "../../api/server";
import testData from "./testData.json";
import { SnackbarProvider } from "notistack";
import { AuthProvider } from "../../content/AuthContent";
import { auth } from "../../firebase";
import { act, cleanup } from "@testing-library/react";

const render = (ui, { ...options } = {}) => {
  const wrapper = (props) => <SnackbarProvider maxSnack={3} {...props} />;
  rtlrender(ui, { wrapper: wrapper, ...options });
};

const server = setupServer(
  rest.get(`${serverURL}/user_events`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(testData));
  }),
  rest.get(`${serverURL}/reserve`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(testData));
  }),
  rest.post(`${serverURL}/reserve`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json("success"));
  }),
  rest.post(`${serverURL}/cancel`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json("success"));
  })
);

const setUpFirebaseAuthEmulator = () => {
  auth.useEmulator("http://localhost:9099");
};

const setUp = () => {
  server.listen();
  setUpFirebaseAuthEmulator();
};

const cleanUpAll = () => {
  server.resetHandlers();
  cleanup();
};

beforeAll(() => setUp());
afterAll(() => server.close());
afterEach(() => cleanUpAll());

describe("show all of user's event test", () => {
  test("data transfer properly", async () => {
    render(<Dashboard />);
    const notiBox = await screen.findByTestId("notiBox");
    expect(notiBox).toHaveTextContent("資料更新成功");
  });

  test("check data-grid's data's correctness", async () => {
    render(<Dashboard />);
    const rowsCts = await screen.findByRole("row");
    for (let i = 1; i < rowsCts.length; i++) {
      for (const j of rows[i]) {
        expect(rowsCts[i]).toHaveTextContent(testData[i - 1][j]);
      }
    }

    const notiBox = await screen.findByTestId("notiBox");
    expect(notiBox).toHaveTextContent("資料更新成功");
  });

  test("data transfer fail", async () => {
    server.use(
      rest.get(`${serverURL}/user_events`, (req, res, ctx) => {
        return res(ctx.status(404));
      })
    );
    render(<Dashboard />);
    const notiBox = await screen.findByTestId("notiBox");
    expect(notiBox).toHaveTextContent("資料更新失敗");
  });
});

describe("craete enroll and delete enroll", () => {
  test("enroll the event", async () => {
    render(<Dashboard />);
    let notiBox = await screen.findByTestId("notiBox");
    expect(notiBox).toHaveTextContent("資料更新成功");
    const enrollCtlBtn = await screen.findAllByTestId("enrollCtlBtn");

    // first one is enroll btn
    fireEvent.click(enrollCtlBtn[0]);
    const enrollModal = await screen.findByTestId("enrollModal");
    expect(enrollModal).toBeInTheDocument();

    const enrollBtn = within(enrollModal).getByTestId("enrollBtn");
    enrollBtn.click();
    notiBox = await screen.findByText("成功註冊");
    expect(notiBox).toBeInTheDocument();

    await screen.findAllByText("資料更新成功");
  });

  test("cancel the event", async () => {
    render(<Dashboard />);
    let notiBox = await screen.findByTestId("notiBox");
    expect(notiBox).toHaveTextContent("資料更新成功");
    const enrollCtlBtn = await screen.findAllByTestId("enrollCtlBtn");

    // second one is cancel btn
    fireEvent.click(enrollCtlBtn[1]);
    const enrollModal = await screen.findByTestId("enrollModal");
    expect(enrollModal).toBeInTheDocument();

    const enrollBtn = within(enrollModal).getByTestId("enrollBtn");
    enrollBtn.click();
    // screen.debug(undefined, 30000000);
    notiBox = await screen.findByText("成功取消");
    expect(notiBox).toBeInTheDocument();

    await screen.findAllByText("資料更新成功");
  });
});
