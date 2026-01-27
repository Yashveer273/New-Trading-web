import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Search,
  User,
  Zap,
  Activity,
  Wallet,
  ShieldCheck,
  BarChart3,
  Award,
  CheckCircle2,
  Globe,
  Lock,
} from "lucide-react";
import "./styles/productscreen.css";
import Navigation from "./components/Navigation";
import InvestmentCard from "./components/InvestmentCard";
import { Footer } from "./components/footer";


const MarketTicker = () => {
  const items = [
    { s: "NIFTY 50", v: "22,123.45", c: "+0.45%" },
    { s: "SENSEX", v: "72,850.12", c: "+0.38%" },
    { s: "BANK NIFTY", v: "46,900.20", c: "-0.12%" },
    { s: "USD/INR", v: "83.12", c: "0.00%" },
    { s: "GOLD", v: "62,450", c: "+1.2%" },
  ];
  return (
    <div className="market-ticker-bar">
      <div className="ticker-track">
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} className="ticker-item">
            <span style={{ color: 'white' }}>{item.s}</span>
            <span>{item.v}</span>
            <span style={{ color: item.c.startsWith('+') ? 'var(--success)' : 'var(--danger)' }}>{item.c}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
const ProductScreen = () => {
  const [search, setSearch] = useState("");
  const [balance, setBalance] = useState(420500.0);

  const stocks = [
    {
      ticker: "RELIANCE",
      name: "Reliance Industries",
      currentPrice: 2945.5,
      changePercentage: 1.45,
    },
    {
      ticker: "TCS",
      name: "Tata Consultancy Services",
      currentPrice: 4120.35,
      changePercentage: -0.85,
    },
    {
      ticker: "HDFCBANK",
      name: "HDFC Bank Ltd",
      currentPrice: 1642.1,
      changePercentage: 0.65,
    },
    {
      ticker: "INFY",
      name: "Infosys Limited",
      currentPrice: 1534.0,
      changePercentage: 2.1,
    },
    {
      ticker: "ZOMATO",
      name: "Zomato Limited",
      currentPrice: 214.2,
      changePercentage: 4.25,
    },
    {
      ticker: "TATAMOTORS",
      name: "Tata Motors",
      currentPrice: 982.5,
      changePercentage: 1.1,
    },
  ];

  const filtered = stocks.filter((s) =>
    s.ticker.toLowerCase().includes(search.toLowerCase()),
  );

  const handleBuy = (stock, qty) => {
    setBalance((prev) => prev - stock.currentPrice * qty);
  };

  return (
    <div className="app-container">
      <Navigation />
    <MarketTicker />
      {/* Default Account Section (Wallet View) */}
      <div className="account-summary">
        <div className="account-inner">
          <div className="wallet-stat">
            <div className="stat-icon">
              <Wallet size={24} />
            </div>
            <div>
              <p className="label-xs">Available Margin</p>
              <p style={{ fontSize: "24px", fontWeight: 900, color: "white" }}>
                ₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div
            style={{
              height: "40px",
              width: "1px",
              background: "var(--border)",
            }}
          />

          <div className="wallet-stat">
            <div
              className="stat-icon"
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                color: "var(--success)",
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="label-xs">Account Status</p>
              <p style={{ fontSize: "14px", fontWeight: 900, color: "white" }}>
                Institutional Verified
              </p>
            </div>
          </div>
        </div>
      </div>

      <header className="header-section">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <Activity size={16} color="#2563eb" />
          <span
            className="label-xs"
            style={{ color: "#2563eb", letterSpacing: "2px", marginBottom: 0 }}
          >
            Terminal Live
          </span>
        </div>
        <h1
          style={{
            fontSize: "48px",
            fontWeight: 900,
            fontStyle: "italic",
            textTransform: "uppercase",
            margin: 0,
            color: "white",
            letterSpacing: "-1px",
          }}
        >
          Equities
        </h1>

        <div
          style={{ position: "relative", maxWidth: "500px", marginTop: "24px" }}
        >
          <Search
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b",
            }}
            size={20}
          />
          <input
            className="search-input"
            placeholder="Search by ticker symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="market-grid">
        {filtered.map((s, i) => (
          <InvestmentCard key={i} stock={s} onBuy={handleBuy} />
        ))}
      </div>
       <section className="trust-grid">
          <div className="trust-card">
            <Lock className="stat-icon" style={{ margin: '0 auto' }} />
            <h4>Zero-Knowledge Security</h4>
            <p>Your assets are protected by enterprise-grade cold storage and multi-sig protocols.</p>
          </div>
          <div className="trust-card">
            <BarChart3 className="stat-icon" style={{ margin: '0 auto' }} />
            <h4>High-Frequency Engine</h4>
            <p>Execute orders with sub-millisecond latency via our direct market access nodes.</p>
          </div>
          <div className="trust-card">
            <Award className="stat-icon" style={{ margin: '0 auto' }} />
            <h4>Regulatory Compliance</h4>
            <p>Fully compliant with SEBI guidelines and NSE/BSE reporting standards.</p>
          </div>
        </section>

        {/* --- NEW SECTION: COMPLIANCE STRIP --- */}
        <div className="compliance-strip">
          <div className="compliance-item">
            <CheckCircle2 size={16} />
            SEBI Reg. INZ00012345
          </div>
          <div className="compliance-item">
            <Globe size={16} />
            Global Edge Network
          </div>
          <div className="compliance-item">
            <Lock size={16} />
            SIPC Protected
          </div>
        </div>
        <Footer />
    </div>
  );
};

export default ProductScreen;
