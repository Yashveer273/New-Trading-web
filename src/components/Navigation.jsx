import { Zap, User, Menu, X, LogOut, LogIn, CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import "../styles/productscreen.css";
import "../styles/home.css";


const Navigation = () => {

  const [mobileOpen, setMobileOpen] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(true);
   const navigator = useNavigate();
  

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Markets", path: "/Market" },
    { label: "About", path: "/" },
  ];
 

  const handleAuth = () => {
    setIsLoggedIn(!isLoggedIn);
      navigator("/auth")
    
   
  };
  return (
    <nav className="v-nav">
      <div className="v-container v-nav-inner">
        
        {/* Logo */}
        <Link to="/" className="">
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

         
          <div className="v-nav-actions">
            {isLoggedIn ? (
              <div className="v-user-row">
                <button className="v-auth-btn v-logout" onClick={()=>handleAuth()}>
                  <LogOut size={16} />
                  <span>LOGOUT</span>
                </button>
                
                <Link key="/account" to="/account"  style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Account
            </Link>
                <div className="v-user" onClick={()=>navigator("/account")}>
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="User" />
                </div>
              </div>
            ) : (
              <button className="v-auth-btn v-login"onClick={()=> handleAuth()} >
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
            style={{ color: "#e5e7eb", fontWeight: 600, textDecoration: "none" }}
          >
            {link.label}
          </Link>
        ))}

        
      
      </div>
    </nav>
  );
};

export default Navigation;

