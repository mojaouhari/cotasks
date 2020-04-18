import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="border border-2 border-dark m-2">
      <div className={`p-3 text-left`}>
        <div className="h1 m-0">CoTasks</div>
      </div>
      <div className={`p-3 text-left small-bold border-top border-2 border-dark `}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
        in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
        officia deserunt mollit anim id est laborum.
      </div>
      <div className="border-top border-2 border-dark clickable text-left p-0">
        <Link to="/login" className="p-3 text-body text-decoration-none d-block">
          <div className="small-bold">Already have an account?</div>
          LOG IN
        </Link>
      </div>
      <div className="border-top border-2 border-dark clickable text-left p-0">
        <Link to="/signup" className="p-3 text-body text-decoration-none d-block">
          CREATE AN ACCOUNT
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
