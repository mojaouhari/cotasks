import React, { useState } from "react";
import Axios from "axios";

const Auth = ({ authenticate, isLogin }) => {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [signup, setSignup] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const initialAuthValidation = {
    firstname: {
      valid: null,
      msg: "",
    },
    lastname: {
      valid: null,
      msg: "",
    },
    username: {
      valid: null,
      msg: "",
    },
    email: {
      valid: null,
      msg: "",
    },
    password: {
      valid: null,
      msg: "",
    },
    password2: {
      valid: null,
      msg: "",
    },
  };
  const [authValidation, setAuthValidation] = useState(initialAuthValidation);

  const handleLoginChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };
  const handleSignupChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await Axios.post(`/api/auth/`, { ...login });
      authenticate(res.data.token);
    } catch (error) {
      authenticate();
      // update validation messages
      let validation = {};
      const errors = error.response.data.errors;
      if (errors)
        errors.map((error) => {
          validation[error.param] = { valid: false, msg: error.msg };
        });
      setAuthValidation({ ...initialAuthValidation, ...validation });
    }
  };
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await Axios.post(`/api/users/`, { ...signup });
      authenticate(res.data.token);
    } catch (error) {
      authenticate();
      // update validation messages
      let validation = {};
      const errors = error.response.data.errors;
      if (errors)
        errors.map((error) => {
          validation[error.param] = { valid: false, msg: error.msg };
        });
      setAuthValidation({ ...initialAuthValidation, ...validation });
    }
  };

  return (
    <div className="border border-2 border-dark m-2">
      <div className="d-flex flex-row">
        <div className={`p-3 flex-grow-1 text-left`}>
          <div className="small-bold">WELCOME {isLogin ? "BACK" : ""}</div>
          {isLogin ? "Log back into" : "Create"} your account
        </div>
      </div>
      <div className="d-flex flex-row bg-dark text-white-50 border-top border-2 border-dark small-bold">
        <div className="p-2 flex-72">VALID?</div>
        <div className="border-left border-2 border-dark p-2 flex-grow-1">CREDENTIALS</div>
      </div>
      {isLogin ? (
        <form onSubmit={(e) => handleLoginSubmit(e)}>
          <div className={`task-row d-flex flex-row border-top border-2 border-dark text-muted`}>
            <div className={`flex-72 bg-dark text-center`}>
              {authValidation.email.valid === false && (
                <div className="text-danger" style={{ paddingTop: 21 }}>
                  NO
                </div>
              )}
            </div>
            <div className={`border-left border-2 border-dark flex-grow-1`}>
              <input
                required
                type="email"
                name="email"
                placeholder="Your email address"
                className={`border-0 h-100 w-100 text-body px-2 pt-2 pb-1 editable p-2`}
                onChange={(e) => handleLoginChange(e)}
                onBlur={(e) => handleLoginChange(e)}
              />
            </div>
          </div>
          <div className={`task-row d-flex flex-row border-top border-2 border-dark text-muted`}>
            <div className={`flex-72 bg-dark text-center`}>
              {authValidation.password.valid === false && (
                <div className="text-danger" style={{ paddingTop: 21 }}>
                  NO
                </div>
              )}
            </div>
            <div className={`border-left border-2 border-dark flex-grow-1`}>
              <input
                required
                type="password"
                name="password"
                placeholder="Password"
                className={`border-0 h-100 w-100 text-body px-2 pt-2 pb-1 editable p-2`}
                onChange={(e) => handleLoginChange(e)}
                onBlur={(e) => handleLoginChange(e)}
              />
            </div>
          </div>
          <div className="border-top border-2 border-dark">
            <input type="submit" className="task-row w-100 clickable p-3 text-body text-left" value="LOG IN" />
          </div>
        </form>
      ) : (
        <form onSubmit={(e) => handleSignupSubmit(e)}>
          <div className={`task-row d-flex flex-row border-top border-2 border-dark text-muted`}>
            <div className={`flex-72 bg-dark text-center`}>
              {authValidation.firstname.valid === false && (
                <div className="text-danger" style={{ paddingTop: 21 }}>
                  NO
                </div>
              )}
            </div>
            <div className={`border-left border-2 border-dark flex-grow-1`}>
              <input
                required
                type="text"
                name="firstname"
                placeholder="First name"
                className={`border-0 h-100 w-100 text-body px-2 pt-2 pb-1 editable p-2`}
                onChange={(e) => handleSignupChange(e)}
                onBlur={(e) => handleSignupChange(e)}
              />
            </div>
          </div>
          <div className={`task-row d-flex flex-row border-top border-2 border-dark text-muted`}>
            <div className={`flex-72 bg-dark text-center`}>
              {authValidation.lastname.valid === false && (
                <div className="text-danger" style={{ paddingTop: 21 }}>
                  NO
                </div>
              )}
            </div>
            <div className={`border-left border-2 border-dark flex-grow-1`}>
              <input
                required
                type="text"
                name="lastname"
                placeholder="Last name"
                className={`border-0 h-100 w-100 text-body px-2 pt-2 pb-1 editable p-2`}
                onChange={(e) => handleSignupChange(e)}
                onBlur={(e) => handleSignupChange(e)}
              />
            </div>
          </div>
          <div className={`task-row d-flex flex-row border-top border-2 border-dark text-muted`}>
            <div className={`flex-72 bg-dark text-center`}>
              {authValidation.username.valid === false && (
                <div className="text-danger" style={{ paddingTop: 21 }}>
                  NO
                </div>
              )}
            </div>
            <div className={`border-left border-2 border-dark flex-grow-1`}>
              <input
                required
                type="text"
                name="username"
                placeholder="Pick a unique username..."
                className={`border-0 h-100 w-100 text-body px-2 pt-2 pb-1 editable p-2`}
                onChange={(e) => handleSignupChange(e)}
                onBlur={(e) => handleSignupChange(e)}
              />
            </div>
          </div>
          <div className={`task-row d-flex flex-row border-top border-2 border-dark text-muted`}>
            <div className={`flex-72 bg-dark text-center`}>
              {authValidation.email.valid === false && (
                <div className="text-danger" style={{ paddingTop: 21 }}>
                  NO
                </div>
              )}
            </div>
            <div className={`border-left border-2 border-dark flex-grow-1`}>
              <input
                required
                type="email"
                name="email"
                placeholder="Your email address"
                className={`border-0 h-100 w-100 text-body px-2 pt-2 pb-1 editable p-2`}
                onChange={(e) => handleSignupChange(e)}
                onBlur={(e) => handleSignupChange(e)}
              />
            </div>
          </div>
          <div className={`task-row d-flex flex-row border-top border-2 border-dark text-muted`}>
            <div className={`flex-72 bg-dark text-center`}>
              {authValidation.password.valid === false && (
                <div className="text-danger" style={{ paddingTop: 21 }}>
                  NO
                </div>
              )}
            </div>
            <div className={`border-left border-2 border-dark flex-grow-1`}>
              <input
                required
                type="password"
                name="password"
                placeholder="Password"
                className={`border-0 h-100 w-100 text-body px-2 pt-2 pb-1 editable p-2`}
                onChange={(e) => handleSignupChange(e)}
                onBlur={(e) => handleSignupChange(e)}
              />
            </div>
          </div>
          <div className={`task-row d-flex flex-row border-top border-2 border-dark text-muted`}>
            <div className={`flex-72 bg-dark text-center`}>
              {authValidation.password2.valid === false && (
                <div className="text-danger" style={{ paddingTop: 21 }}>
                  NO
                </div>
              )}
            </div>
            <div className={`border-left border-2 border-dark flex-grow-1`}>
              <input
                required
                type="password"
                name="password2"
                placeholder="Confirm password"
                className={`border-0 h-100 w-100 text-body px-2 pt-2 pb-1 editable p-2`}
                onChange={(e) => handleSignupChange(e)}
                onBlur={(e) => handleSignupChange(e)}
              />
            </div>
          </div>
          <div className="border-top border-2 border-dark">
            <input type="submit" className="task-row w-100 clickable p-3 text-body text-left" value="SIGN UP" />
          </div>
        </form>
      )}
    </div>
  );
};

export default Auth;
