import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState({
    name: "Trader",
    email: "trader@tradex.com",
    initials: "TX",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("tradex_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const initials = parsed.name
          ? parsed.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()
          : "TX";
        setUser({
          name: parsed.name,
          email: parsed.email || "trader@tradex.com",
          initials,
        });
      } catch (e) {
        // Fallback
      }
    } else {
      const name = localStorage.getItem("dashboardTraderName");
      if (name) {
        const initials = name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase();
        setUser({ name, email: `${name.toLowerCase().replace(/\s+/g, "")}@tradex.com`, initials });
      }
    }
  }, []);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("tradex_token");
    localStorage.removeItem("tradex_user");
    localStorage.removeItem("dashboardTraderName");
    // Redirect to landing page / login
    window.location.href = "http://localhost:3000/login";
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <Link to="/" onClick={() => handleMenuClick(0)}>
        <img src="/logo.svg" alt="TradeX" style={{ width: "130px" }} />
      </Link>
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/apps"
              onClick={() => handleMenuClick(5)}
            >
              <p className={selectedMenu === 5 ? activeMenuClass : menuClass}>
                Apps
              </p>
            </Link>
          </li>
        </ul>
        <hr />
        <div style={{ position: "relative" }}>
          <div className="profile" onClick={handleProfileClick} style={{ cursor: "pointer" }}>
            <div className="avatar">{user.initials}</div>
            <p className="username">{user.name.split(" ")[0]}</p>
          </div>

          {isProfileDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "45px",
                right: 0,
                backgroundColor: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                borderRadius: "6px",
                width: "220px",
                padding: "16px",
                zIndex: 1000,
                border: "1px solid #eee",
              }}
            >
              <div style={{ marginBottom: "12px", borderBottom: "1px solid #f0f0f0", paddingBottom: "10px" }}>
                <div style={{ fontWeight: "600", fontSize: "14px", color: "#333" }}>{user.name}</div>
                <div style={{ fontSize: "12px", color: "#888" }}>{user.email}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <a
                  href="http://localhost:3000"
                  style={{ textDecoration: "none", color: "#387ed1", fontSize: "13px" }}
                >
                  Visit TradeX Portal
                </a>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: "#fef0f0",
                    color: "#df514c",
                    border: "1px solid #fcdada",
                    borderRadius: "4px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontSize: "13px",
                    marginTop: "6px",
                    textAlign: "center",
                    fontWeight: "500",
                  }}
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
