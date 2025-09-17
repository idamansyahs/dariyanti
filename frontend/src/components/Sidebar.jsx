// src/components/Sidebar.jsx
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    // { path: "/dashboard", label: "Dashboard" },
    { path: "/room", label: "Rooms" },
    { path: "/bookings", label: "Bookings" },
    { path: "/konten-management", label: "konten"}
  ];

  return (
    <aside className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white min-vh-100" style={{ width: "250px" }}>
      {/* Logo */}
      <div className="text-center mb-4 border-bottom pb-3">
        <h2 className="fs-4 fw-bold">Hotel Admin</h2>
      </div>

      {/* Navigation */}
      <ul className="nav nav-pills flex-column mb-auto">
        {navItems.map((item) => (
          <li className="nav-item" key={item.path}>
            <Link
              to={item.path}
              className={`nav-link ${
                location.pathname === item.path ? "active" : "text-white"
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
