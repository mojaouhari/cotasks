import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="border border-2 border-dark m-2">
      <div className={`p-3 text-left bg-dark text-light`}>
        <div className="h1 m-0 font-weight-bold">CoTasks</div>
      </div>
      <div className={`p-3 text-left small-bold border-top border-2 border-dark `}>
        CoTasks is a simple app to help you organize your daily tasks in a very efficient way, all while giving you the opportunity to share
        them with collaborators!
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
