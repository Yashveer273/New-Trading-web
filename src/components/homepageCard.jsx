import React, { useState } from 'react';
import { 
  Zap, 
  Globe, 
  BarChart4,
  ArrowUpRight,
  CandlestickChart,
  Activity,
  TrendingUp,
  TrendingDown,
  User
} from 'lucide-react';
import '../styles/homepageCard.css';
const HomepageCard = () => {
  const [activeTab, setActiveTab] = useState('All');
  const isLoaded  = true;

 

  const services = [
    {
      id: 1,
      title: "Bitcoin & Altcoins",
      subtitle: "Professional crypto liquidity pools with sub-millisecond execution for institutional players.",
      icon: <Zap size={28} />,
      price: "$67,402.10",
      change: "+2.4%",
      trend: "up",
      color: "#3b82f6",
      tags: ["High Vol", "24/7", "BTC/USD"],
      category: "Digital"
    },
    {
      id: 2,
      title: "Blue-Chip Stocks",
      subtitle: "Direct access to NYSE and NASDAQ. High-frequency trading across top 500 tech companies.",
      icon: <BarChart4 size={28} />,
      price: "AAPL: $192.25",
      change: "+1.2%",
      trend: "up",
      color: "#10b981",
      tags: ["NASDAQ", "NYSE", "DIVIDENDS"],
      category: "Traditional"
    },
    {
      id: 3,
      title: "Global Commodities",
      subtitle: "Trade gold, silver, and brent oil with competitive spreads and deep market depth.",
      icon: <Globe size={28} />,
      price: "GOLD: $2,380",
      change: "-0.3%",
      trend: "down",
      color: "#f59e0b",
      tags: ["METALS", "ENERGY", "PHYSICAL"],
      category: "Traditional"
    },
    {
      id: 4,
      title: "Market Indices",
      subtitle: "Leverage global market movements with indices like SPX500, NAS100, and UK100.",
      icon: <CandlestickChart size={28} />,
      price: "SPX: 5,230.1",
      change: "+0.7%",
      trend: "up",
      color: "#a855f7",
      tags: ["DERIVATIVES", "MARGIN", "GLOBAL"],
      category: "Traditional"
    }
  ];

  const filteredServices = services.filter(s => activeTab === 'All' || s.category === activeTab);

 

  return (
    <div className="dashboard-container">
      
      <div className="glow-bg" />

      {/* Top Left Menu Section */}
      <header className="menu-header">
        <span className="filter-label">Market Explorer</span>
        <div className="filter-menu">
          {['All', 'Digital', 'Traditional'].map((category) => (
            <button
              key={category}
              className={`filter-btn ${activeTab === category ? 'active' : ''}`}
              onClick={() => setActiveTab(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      {/* Cards Scroll Row */}
      <main className="cards-grid">
        {filteredServices.map((asset, index) => (
          <div 
            key={asset.id} 
            className="asset-card" 
            style={{ 
              animation: isLoaded ? `fadeIn 0.5s ease-out ${index * 0.1}s forwards` : 'none',
              opacity: isLoaded ? 1 : 0
            }}
          >
            <div>
              <div className="card-top">
                <div className="icon-box" style={{ color: asset.color }}>
                  {asset.icon}
                </div>
                <div className="price-display">
                  <div className="ticker-price">{asset.price}</div>
                  <div className="percentage" style={{ color: asset.trend === 'up' ? '#10b981' : '#f43f5e' }}>
                    {asset.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {asset.change}
                  </div>
                </div>
              </div>

              <h3 className="card-title">{asset.title}</h3>
              <p className="card-subtitle">{asset.subtitle}</p>

              <div className="tag-container">
                {asset.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>

            <div className="card-footer">
              <span className="footer-label">Terminal Direct</span>
              <div className="arrow-btn">
                <User size={20} />
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Subtle Footer Status */}
      <div style={{ paddingTop: '20px', width: '100%', display: 'flex', alignItems: 'center', gap: '20px', opacity: 0.2 }}>
        <Activity size={16} />
        <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em' }}>
          System Online • Vertex Engine v4.0.1
        </span>
      </div>
    </div>
  );
};

export default HomepageCard;