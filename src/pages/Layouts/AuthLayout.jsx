import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Tempat route anak seperti Login dirender */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
