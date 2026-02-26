import React, { useEffect, useState, useMemo } from "react";
import { firestore } from "./firebaseCon";
import { Search, Activity, BarChart3, Award, Lock } from "lucide-react";
import "./styles/productscreen.css";
import Navigation from "./components/Navigation";
import InvestmentCard from "./components/InvestmentCard";
import { Footer } from "./components/footer";
import { buyProduct } from "./api";
import { collection, onSnapshot } from "firebase/firestore";

/**
 * Helper: Generates a completely random jump within boundaries
 */
const calculateRandomJump = (min, max) => {
  const range = max - min;
  return Number((min + Math.random() * range).toFixed(2));
};

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
            <span style={{ color: item.c.startsWith("+") ? "var(--success)" : "var(--danger)" }}>
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

  // 1. Initial Fetch from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, "Stock"), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          _id: doc.id,
          ...d,
          // Initialize live price
          currentPrice: d.currentPrice || d.minPrice || 0,
          trend: "NO_CHANGE"
        };
      });
      setStocks(data);
    });
    return () => unsubscribe();
  }, []);

  // 2. High-Quality Master Fluctuation Engine
  // One interval handles ALL products to save CPU/Memory
  useEffect(() => {
    if (stocks.length === 0) return;

    const masterHeartbeat = setInterval(() => {
      setStocks((currentStocks) =>
        currentStocks.map((s) => {
          const min = Number(s.minPrice || 0);
          const max = Number(s.maxPrice || 100);
          
          const nextPrice = calculateRandomJump(min, max);
          const trend = nextPrice > s.currentPrice ? "UP" : "DOWN";

          return {
            ...s,
            currentPrice: nextPrice,
            trend: trend,
            // Calculate percentage based on initial min price
            priceChangePercent: min !== 0 ? ((nextPrice - min) / min) * 100 : 0,
          };
        })
      );
    }, 3000); // Global jump every 3 seconds

    return () => clearInterval(masterHeartbeat);
  }, [stocks.length > 0]); 

  // 3. Optimized Search Filtering
  const filteredStocks = useMemo(() => {
    const query = search.toLowerCase();
    return stocks.filter(
      (s) =>
        s.name?.toLowerCase().includes(query) ||
        s.companyName?.toLowerCase().includes(query)
    );
  }, [stocks, search]);

  const handleBuy = async (stock, qty) => {
    try {
      setStatus(true);
      await buyProduct({ 
        stockId: stock._id, 
        quantity: qty, 
        currentPrice: stock.currentPrice 
      });
    } catch (err) {
      console.error("❌ Transaction Error:", err);
    } finally {
      setStatus(false);
    }
  };

  return (
    <div className="product-screen-root">
      <Navigation />
      <MarketTicker />

      <header className="header-section">
        <div className="terminal-status">
          <Activity size={16} color="#2563eb" />
          <span className="label-xs">Terminal Live</span>
        </div>
        
        <h1 className="main-title">Equities</h1>

        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            className="search-input"
            placeholder="Search by ticker or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <main className="market-grid">
        {filteredStocks.length > 0 ? (
          filteredStocks.map((s) => (
            <InvestmentCard
              key={s._id}
              stock={s}
              onBuy={handleBuy}
              Status={status}
            />
          ))
        ) : (
          <div className="empty-state">
            {stocks.length === 0 
              ? "Establishing Secure Connection..." 
              : "No matches found for your search."}
          </div>
        )}
      </main>

      <section className="trust-grid">
        <div className="trust-card">
          <Lock className="stat-icon" />
          <h4>Zero-Knowledge Security</h4>
          <p>Assets protected by enterprise-grade cold storage.</p>
        </div>
        <div className="trust-card">
          <BarChart3 className="stat-icon" />
          <h4>High-Frequency Engine</h4>
          <p>Sub-millisecond latency order execution.</p>
        </div>
        <div className="trust-card">
          <Award className="stat-icon" />
          <h4>Regulatory Compliance</h4>
          <p>Fully compliant with SEBI and exchange standards.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductScreen;