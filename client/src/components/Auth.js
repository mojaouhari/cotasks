import React from "react";

const Auth = () => {
  return (
    <div className="border border-2 border-dark m-2">
      <div className="d-flex flex-row">
        <div className={`p-3 flex-grow-1 text-left`}>
          <div className="small-bold">WELCOME BACK</div>
          Log back into your account
        </div>
      </div>
      <div className="d-flex flex-row bg-dark text-white-50 border-top border-2 border-dark small-bold">
        <div className="p-2 flex-72">VALID?</div>
        <div className="border-left border-2 border-dark p-2 flex-grow-1">CREDENTIALS</div>
      </div>
      <div className={`task-row d-flex flex-row border-top border-2 border-dark text-muted`}>username or email</div>
      <div className={`task-row d-flex flex-row border-top border-2 border-dark text-muted`}>password</div>
      <div className="task-row border-top border-2 border-dark clickable px-3 text-left" onClick={() => {}}>
        LOG IN
      </div>
    </div>
  );
};

export default Auth;
