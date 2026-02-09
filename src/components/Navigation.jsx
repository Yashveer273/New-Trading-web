import { Zap, User, Menu, X, LogOut, LogIn } from "lucide-react";
import { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import "../styles/productscreen.css";
import "../styles/home.css";
import Cookies from "js-cookie";
import { getUserData } from "../api";

const Navigation = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getUserData();
      setUser(userData);
    };
    loadUser();
  }, []);

  const [mobileOpen, setMobileOpen] = useState(false);

  const navigator = useNavigate();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Markets", path: "/Market" },
    { label: "About", path: "/" },
  ];
  const handleAuth = () => {
    if (user) {
      Cookies.remove("tredingUser");
      setUser(null);
      navigator("/");
    } else {
      navigator("/auth");
    }
  };

  return (
    <nav className="v-nav">
      <div className="v-container v-nav-inner">
        {/* Logo */}
        <Link to="/" className="">
          <div className="logo-icon">
            <Zap size={20} color="white" />
          </div>
          <span className="logo-text">Vertex</span>
        </Link>

        {/* Desktop Links */}
        <div className="v-nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              style={{
                color: "#94a3b8",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {link.label}
            </Link>
          ))}

          <div className="v-nav-actions">
            {user ? (
              <div className="v-user-row">
                <button
                  className="v-auth-btn v-logout"
                  onClick={() => handleAuth()}
                >
                  <LogOut size={16} />
                  <span>LOGOUT</span>
                </button>

                <Link
                  key="/account"
                  to="/account"
                  style={{
                    color: "#94a3b8",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Account
                </Link>
                <div className="v-user" onClick={() => navigator("/account")}>
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "User"}`}
                    alt="User"
                  />
                </div>
              </div>
            ) : (
              <button
                className="v-auth-btn v-login"
                onClick={() => handleAuth()}
              >
                <LogIn size={16} />
                <span>LOGIN</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="v-menu-mobile"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ zIndex: 20 }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        className="mobile-menu"
        style={{
          display: mobileOpen ? "flex" : "none",
          flexDirection: "column",
          gap: "16px",
          background: "#111827",
          padding: "20px",
          position: "absolute",
          top: "60px",
          left: 0,
          width: "100%",
          zIndex: 15,
        }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.path}
            className="mobile-link"
            onClick={() => setMobileOpen(false)}
            style={{
              color: "#e5e7eb",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {link.label}
          </Link>
        ))}
        <div
          style={{
            borderTop: "1px solid #1f2937",
            paddingTop: "16px",
            marginTop: "8px",
          }}
        >
          {user ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <Link
                to="/account"
                onClick={() => setMobileOpen(false)}
                style={{
                  color: "#e5e7eb",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                ACCOUNT
              </Link>
              <button
                className="v-auth-btn v-logout"
                onClick={() => {
                  handleAuth();
                  setMobileOpen(false);
                }}
                style={{ width: "fit-content" }}
              >
                <LogOut size={16} />
                <span>LOGOUT</span>
              </button>
            </div>
          ) : (
            <button
              className="v-auth-btn v-login"
              onClick={() => {
                handleAuth();
                setMobileOpen(false);
              }}
              style={{ width: "fit-content" }}
            >
              <LogIn size={16} />
              <span>LOGIN</span>
            </button>
          )}
        </div>
      </div>
      
    </nav>
  );
};

export default Navigation;
