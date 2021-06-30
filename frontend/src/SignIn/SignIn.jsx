import React, { useRef, useState, useEffect } from "react";
import { MDBCard, MDBBtn } from "mdb-react-ui-kit";
import Alert from "@material-ui/lab/Alert";
import { useAuth } from "../content/AuthContent";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";

function Index() {
  const userNameRef = useRef();
  const passWdRef = useRef();
  const { signin } = useAuth();
  const [errMsg, setErrMsg] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const onSubmit = async (e) => {
    e.preventDefault();
    await signin(userNameRef.current.value, passWdRef.current.value)
      .then(() => {
        enqueueSnackbar(<div data-testid="notiBox">{`登入成功`}</div>, {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 1500,
        });
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
        setErrMsg("Fail to Sign In.");
      });
  };
  return (
    <div
      className="d-flex align-items-center justify-content-center h-100"
      data-testid="SignInForm"
    >
      <MDBCard className="d-flex p-4 mt-5">
        <form onSubmit={onSubmit}>
          <p className="h4 text-center mb-4 font-weight-bold">Sign in</p>
          {errMsg !== "" && (
            <Alert severity="error" className="my-2">
              {errMsg}
            </Alert>
          )}
          <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
            Your email
          </label>
          <input
            type="email"
            id="defaultFormLoginEmailEx"
            className="form-control"
            ref={userNameRef}
            data-testid="usernameInput"
          />
          <br />
          <label htmlFor="defaultFormLoginPasswordEx" className="grey-text">
            Your password
          </label>
          <input
            type="password"
            id="defaultFormLoginPasswordEx"
            className="form-control"
            ref={passWdRef}
            data-testid="passwdInput"
          />
          <div className="text-center mt-4">
            <MDBBtn color="indigo" type="submit" data-testid="submitSignInBtn">
              Login
            </MDBBtn>
          </div>
        </form>
      </MDBCard>
    </div>
  );
}

export default Index;
