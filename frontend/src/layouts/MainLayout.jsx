import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();

  const navItems = user
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/register", label: "Register Device" },
        { to: "/transfer", label: "Transfer" },
        { to: "/report", label: "Report Stolen" },
        { to: "/verify", label: "Check Device" }
      ]
    : [
        { to: "/login", label: "Login" },
        { to: "/account", label: "Sign Up" }
      ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container topbar__inner">
          <div className="brand">
            <p className="brand__eyebrow">DeviceShield-NG</p>
            <h1 className="brand__title">Secure device ownership</h1>
          </div>
          <nav className="nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav__link ${isActive ? "nav__link--active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {user ? (
              <button type="button" className="nav__link" onClick={logout}>
                Logout
              </button>
            ) : null}
          </nav>
        </div>
      </header>
      <main className="container main">{children}</main>
    </div>
  );
};

export default MainLayout;
