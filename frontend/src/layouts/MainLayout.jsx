import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/verify", label: "Check Device" },
  { to: "/register", label: "Register" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/report", label: "Report Stolen" },
  { to: "/transfer", label: "Transfer" }
];

const MainLayout = ({ children }) => {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container topbar__inner">
          <div className="brand">
            <p className="brand__eyebrow">DeviceShield</p>
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
          </nav>
        </div>
      </header>
      <main className="container main">{children}</main>
    </div>
  );
};

export default MainLayout;
