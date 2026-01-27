import { Minus, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

const InvestmentCard = ({ stock, onBuy }) => {
  const [qty, setQty] = useState(1);
  const [buying, setBuying] = useState(false);

  const handleExecute = () => {
    setBuying(true);
    setTimeout(() => {
      onBuy(stock, qty);
      setBuying(false);
    }, 8000);
  };

  const isUp = stock.changePercentage >= 0;

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div>
          <h3 className="ticker">{stock.ticker}</h3>
          <p
            style={{
              fontSize: "10px",
              color: "#64748b",
              fontWeight: 700,
              textTransform: "uppercase",
              marginTop: "4px",
            }}
          >
            {stock.name}
          </p>
        </div>
        <div
          className={`badge ${isUp ? "badge-up" : "badge-down"}`}
          style={{
            padding: "4px 8px",
            borderRadius: "8px",
            fontSize: "10px",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(stock.changePercentage)}%
        </div>
      </div>

      <div className="price-display">
        <div>
          <p className="label-xs">LTP (Market)</p>
          <p style={{ fontSize: "20px", fontWeight: 900, color: "white" }}>
            ₹{stock.currentPrice.toLocaleString()}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p className="label-xs">Slippage</p>
          <p style={{ color: "#10b981", fontSize: "12px", fontWeight: 700 }}>
            0.00%
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <p className="label-xs">Order Quantity</p>
          <p style={{ fontSize: "10px", color: "#475569", fontWeight: 700 }}>
            Limit: 50 Units
          </p>
        </div>
        <div className="qty-control">
          <button
            className="qty-btn"
            onClick={() => setQty(Math.max(1, qty - 1))}
          >
            <Minus size={14} />
          </button>
          <span
            style={{
              width: "40px",
              textAlign: "center",
              fontWeight: 900,
              color: "white",
            }}
          >
            {qty}
          </span>
          <button
            className="qty-btn"
            style={{ background: "#2563eb" }}
            onClick={() => setQty(Math.min(50, qty + 1))}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="payable-summary">
        <p className="label-xs" style={{ color: "#3b82f6" }}>
          Total Payable
        </p>
        <p style={{ fontSize: "24px", fontWeight: 900, color: "white" }}>
          ₹{(qty * stock.currentPrice).toLocaleString()}
        </p>
      </div>

      <button
        className={`execute-btn ${buying ? "buying" : ""}`}
        onClick={handleExecute}
        disabled={buying}
      >
        {buying ? "Broadcasting Order..." : "Execute Buy"}
      </button>
    </div>
  );
};
export default InvestmentCard;
