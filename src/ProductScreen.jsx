import React, { useEffect, useState } from "react";
import {
  Search,
  Activity,
  Wallet,
  ShieldCheck,
  BarChart3,
  Award,
  Lock,
} from "lucide-react";
import "./styles/productscreen.css";
import Navigation from "./components/Navigation";
import InvestmentCard from "./components/InvestmentCard";
import { Footer } from "./components/footer";
import { buyProduct,  fetchStocks, get_by_id_Stock } from "./api";

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
            <span style={{ color: "white" }}>{item.s}</span>
            <span>{item.v}</span>
            <span
              style={{
                color: item.c.startsWith("+")
                  ? "var(--success)"
                  : "var(--danger)",
              }}
            >
              {item.c}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
const ProductScreen = () => {
  const [search, setSearch] = useState("");


  const [stocks, setStocks] = useState([]);
  const [status, setStatus] = useState(false);

  const updateStockInState = (updatedStock) => {
    setStocks((prev) =>
      prev.map((s) =>
        s._id === updatedStock._id ? { ...s, ...updatedStock } : s,
      ),
    );
  };

  useEffect(() => {
    const fetchStocksFromAPI = async () => {
      const data = await fetchStocks();
      console.log(data.products);
      setStocks(data.products);
    };
    fetchStocksFromAPI();
  }, []);

  const handleBuy = async (stock, qty) => {
    try {
      setStatus(true);
      const latestStock = await get_by_id_Stock(stock._id);
      if (latestStock.success) {
        const totalCost = latestStock.product.currentPrice * qty;
        
        console.log(totalCost);
      
        updateStockInState(latestStock.product);
        await buyProduct({ stockId:stock._id, quantity:qty});
      } else {
        throw new Error(latestStock);
      }
    } catch (err) {
      console.error("❌ Buy failed", err);
      throw err;
    }finally{
      setStatus(false);
    }
  };

  return (
    <div className="app-container">
      <Navigation />
      <MarketTicker />


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
        {Array.isArray(stocks) && stocks.length > 0 ? (
          stocks.map((s) => (
            <InvestmentCard
              key={s._id || s.symbol}
              stock={s}
              onBuy={handleBuy}
              Status={status}
            />
          ))
        ) : (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#94a3b8",
              fontWeight: 600,
            }}
          >
            No Stocks Available
          </div>
        )}
      </div>
      <section className="trust-grid">
        <div className="trust-card">
          <Lock className="stat-icon" style={{ margin: "0 auto" }} />
          <h4>Zero-Knowledge Security</h4>
          <p>
            Your assets are protected by enterprise-grade cold storage and
            multi-sig protocols.
          </p>
        </div>
        <div className="trust-card">
          <BarChart3 className="stat-icon" style={{ margin: "0 auto" }} />
          <h4>High-Frequency Engine</h4>
          <p>
            Execute orders with sub-millisecond latency via our direct market
            access nodes.
          </p>
        </div>
        <div className="trust-card">
          <Award className="stat-icon" style={{ margin: "0 auto" }} />
          <h4>Regulatory Compliance</h4>
          <p>
            Fully compliant with SEBI guidelines and NSE/BSE reporting
            standards.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductScreen;
