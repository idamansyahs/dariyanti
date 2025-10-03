// src/components/Sidebar.jsx
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Sidebar({theme}) {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    // { path: "/dashboard", label: "Dashboard" },
    { path: "/room", label: "Rooms" },
    { path: "/bookings", label: "Bookings" },
    { path: "/konten-management", label: "konten" }
  ];

  const sidebarClass = theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark';
  const borderClass = theme === 'dark' ? 'border-secondary' : '';
  const linkClass = theme === 'dark' ? 'text-white' : 'text-dark';

  return (
    <aside className={`d-flex flex-column flex-shrink-0 p-3 min-vh-100 ${sidebarClass}`} style={{ width: "250px" }}>
      {/* Logo */}
      <div className={`text-center mb-4 border-bottom pb-3 ${borderClass}`}>
        <h2 className="fs-4 fw-bold">Hotel Admin</h2>
      </div>

      {/* Navigation */}
      <ul className="nav nav-pills flex-column mb-auto">
        {navItems.map((item) => (
          <li className="nav-item" key={item.path}>
            <Link
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? "active" : linkClass
                }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout */}
      <div className="mt-auto border-top pt-3">
        <button onClick={logout} className="btn btn-danger w-100">
          Logout
        </button>
      </div>
    </aside>
  );
}
