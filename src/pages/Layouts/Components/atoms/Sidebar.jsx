import { NavLink } from "react-router-dom";
import { hasPermission, getCurrentUser } from "../../../../Utils/Helpers/AuthHelpers";

const Sidebar = () => {
  const user = getCurrentUser();
  const panelTitle = user?.role === 'admin' ? 'Admin Panel' : 'User Panel';
  return (
    <aside className="sticky top-0 h-screen bg-blue-800 text-white transition-all duration-300 w-20 lg:w-64 overflow-y-auto shadow-lg">
      <div className="p-4 border-b border-blue-700">
        <span className="text-2xl font-bold hidden lg:block">{panelTitle}</span>
      </div>
      <nav className="p-4 space-y-2">
        {/* Dashboard */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded transition ${
              isActive ? "bg-blue-700" : "hover:bg-blue-700"
            }`
          }
        >
          <span>🏠</span>
          <span className="menu-text hidden lg:inline">Dashboard</span>
        </NavLink>

        {/* Data Management Section */}
        <div className="text-xs uppercase text-blue-300 px-4 py-2 mt-4 hidden lg:block">Data Management</div>
        
        <NavLink
          to="/admin/mahasiswa"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded transition ${
              isActive ? "bg-blue-700" : "hover:bg-blue-700"
            }`
          }
        >
          <span>🎓</span>
          <span className="menu-text hidden lg:inline">Mahasiswa</span>
        </NavLink>

        <NavLink
          to="/admin/dosen"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded transition ${
              isActive ? "bg-blue-700" : "hover:bg-blue-700"
            }`
          }
        >
          <span>👨‍🏫</span>
          <span className="menu-text hidden lg:inline">Dosen</span>
        </NavLink>

        <NavLink
          to="/admin/matakuliah"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded transition ${
              isActive ? "bg-blue-700" : "hover:bg-blue-700"
            }`
          }
        >
          <span>📚</span>
          <span className="menu-text hidden lg:inline">Mata Kuliah</span>
        </NavLink>

        <NavLink
          to="/admin/kelas"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded transition ${
              isActive ? "bg-blue-700" : "hover:bg-blue-700"
            }`
          }
        >
          <span>🏛️</span>
          <span className="menu-text hidden lg:inline">Kelas</span>
        </NavLink>

        <NavLink
          to="/admin/rencana-studi"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded transition ${
              isActive ? "bg-blue-700" : "hover:bg-blue-700"
            }`
          }
        >
          <span>📋</span>
          <span className="menu-text hidden lg:inline">Rencana Studi</span>
        </NavLink>

        {/* Admin Section */}
        {hasPermission('manage_users') && (
          <>
            <div className="text-xs uppercase text-blue-300 px-4 py-2 mt-4 hidden lg:block">Administration</div>
            
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-4 py-2 rounded transition ${
                  isActive ? "bg-blue-700" : "hover:bg-blue-700"
                }`
              }
            >
              <span>⚙️</span>
              <span className="menu-text hidden lg:inline">Users</span>
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded hidden lg:inline">Admin</span>
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;