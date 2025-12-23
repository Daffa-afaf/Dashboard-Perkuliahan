import Button from "./Button";
import Link from "./Link";
import { confirmLogout } from "../../../Utils/Helpers/SwalHelpers";
import { getCurrentUser, hasPermission } from "../../../../Utils/Helpers/AuthHelpers";

const Header = () => {
  const toggleProfileMenu = () => {
    const menu = document.getElementById("profileMenu");
    if (menu) menu.classList.toggle("hidden");
  };

  const handleLogout = () => {
    confirmLogout(() => {
      localStorage.removeItem("user");
      location.href = "/";
    });
  };

  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">Mahasiswa</h1>
        <div className="relative">
          <Button
            onClick={toggleProfileMenu}
            className="w-8 h-8 rounded-full bg-gray-300 focus:outline-none"
          />
          <div
            id="profileMenu"
            className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 hidden"
          >
            <div className="px-4 py-2 text-sm text-gray-700">
              {getCurrentUser()?.name || 'Guest'}
              <div className="text-xs text-gray-500">{getCurrentUser()?.role || 'user'}</div>
            </div>
            <Link href="/admin/users" className={`block px-4 py-2 text-gray-700 hover:bg-gray-100 ${!hasPermission('manage_users') ? 'hidden' : ''}`}>Users</Link>
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
  );
};

export default Header;