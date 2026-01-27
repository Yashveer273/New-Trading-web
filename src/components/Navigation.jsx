import { Zap, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/productscreen.css";
import "../styles/home.css";

const Navigation = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = true;

  const userInfo = {
    name: "John Doe",
    email: "john.doe@example.com",
    accountType: "Institutional Verified",
    balance: 420500.0,
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Markets", path: "/Market" },
    { label: "About", path: "/" },
    
  ];

  return (
    <nav className="v-nav">
      <div className="v-container v-nav-inner">
        
        {/* Logo */}
        <Link to="/" className="v-logo">
          <div className="logo-icon"><Zap size={20} color="white" /></div>
          <span className="logo-text">Vertex</span>
        </Link>

        {/* Desktop Links */}
        <div className="v-nav-links">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.path}  style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {link.label}
            </Link>
          ))}

          {!isLoggedIn ? (
            <Link to="/Market" className="v-btn-primary">Get Started</Link>
          ) :(
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowDetails(!showDetails)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#1f2937",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                <User size={20} />
                <span>{userInfo.name}</span>
              </button>

              {showDetails && (
                <div
                  style={{
                    position: "absolute",
                    top: "40px",
                    right: 0,
                    background: "#111827",
                    borderRadius: "8px",
                    padding: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    minWidth: "220px",
                    zIndex: 50,
                    color: "#e5e7eb",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    fontSize: "13px",
                  }}
                >
                  <p style={{ fontWeight: 700 }}>{userInfo.name}</p>
                  <p style={{ color: "#9ca3af" }}>{userInfo.email}</p>
                  <p>Account: {userInfo.accountType}</p>
                  <p>Balance: ₹{userInfo.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                  <Link
                    to="/profile"
                    style={{ marginTop: "8px", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}
                  >
                    View Profile
                  </Link>
                </div>
              )}
            </div>
          )}
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
            style={{ color: "#e5e7eb", fontWeight: 600, textDecoration: "none" }}
          >
            {link.label}
          </Link>
        ))}

        {!isLoggedIn ? (
          <Link
            to="/markets"
            className="v-btn-primary mobile-btn"
            onClick={() => setMobileOpen(false)}
            style={{ textAlign: "center" }}
          >
            Get Started
          </Link>
        ) : (
            <div
              style={{
                borderTop: "1px solid #374151",
                paddingTop: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                color: "white",
              }}
            >
              <p style={{ fontWeight: 600 }}>{userInfo.name}</p>
              <p style={{ fontSize: "12px", color: "#9ca3af" }}>{userInfo.email}</p>
              <p style={{ fontSize: "12px" }}>Account: {userInfo.accountType}</p>
              <p style={{ fontSize: "12px" }}>
                Balance: ₹{userInfo.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}
      </div>
    </nav>
  );
};

export default Navigation;
