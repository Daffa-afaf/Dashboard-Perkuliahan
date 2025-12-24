import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../Layouts/Components/atoms/Sidebar";
import Card from "../Layouts/Components/atoms/Card";
import Heading from "../Layouts/Components/atoms/Heading";
import Button from "../Layouts/Components/atoms/Button";
import { confirmLogout } from "../../Utils/Helpers/SwalHelpers";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.includes("/mahasiswa")) {
      return "Mahasiswa";
    } else if (location.pathname.includes("/dashboard")) {
      return "Dashboard";
    }
    return "Admin";
  };

  const handleLogout = () => {
    confirmLogout(() => {
      localStorage.removeItem("isAuthenticated");
      navigate("/");
    });
  };

  const toggleProfileMenu = () => {
    const menu = document.getElementById("profileMenu");
    if (menu) menu.classList.toggle("hidden");
  };

  return (

    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">

        <Sidebar />

        {/* Main Content */}
        <div className="flex flex-col flex-1">

          {/* Header */}
          <header className="bg-white shadow-md">
            <div className="flex justify-between items-center px-6 py-4">
              <h1 className="text-2xl font-semibold text-gray-800">{getPageTitle()}</h1>
              <div className="relative">
                <Button
                  onClick={toggleProfileMenu}
                  className="w-8 h-8 rounded-full bg-gray-300 focus:outline-none"
                ></Button>
                <div
                  id="profileMenu"
                  className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 hidden"
                >
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-6 overflow-x-auto">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="bg-white text-center py-4 shadow-inner">
            <p className="text-sm text-gray-600">
              © 2025 Admin Dashboard. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;