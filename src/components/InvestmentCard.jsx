import { Minus, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const InvestmentCard = ({ stock, onBuy }) => {
  const [qty, setQty] = useState(1);
  const [buying, setBuying] = useState(false);

  const handleExecute = async () => {
    setBuying(true);
    try {
      await onBuy(stock, qty);
    } catch (error) {
      console.error(error);
    } finally {
      setBuying(false);
    }
  };

  /* ✅ DB FIELDS */
  const symbol = stock?.name || "";
  const name = stock?.companyName || "";
  const price = Number(stock?.currentPrice) || 0;
  const changePercent = Number(stock?.priceChangePercent) || 0;
  const changeValue = Number(stock?.priceChange) || 0;
  const lastUpdated = stock?.lastUpdated || stock?.createdAt;

  /* 🔥 3-STATE TREND SYSTEM */
  const trend = stock?.trend || "NO_CHANGE";
  const isUp = trend === "UP";
  const isDown = trend === "DOWN";
  const isNeutral = trend === "NO_CHANGE";

  // This color will now apply to both the badges and the main price text
  const changeColor = isUp ? "#10b981" : isDown ? "#ef4444" : "#cbd5e1";

  return (
    <div className="card">
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <h3 className="ticker">{symbol}</h3>
          <p
            style={{
              fontSize: "10px",
              color: "#64748b",
              fontWeight: 700,
              textTransform: "uppercase",
              marginTop: "4px",
            }}
          >
            {name}
          </p>
        </div>

        <div
          className={`badge ${isUp ? "badge-up" : isDown ? "badge-down" : "badge-neutral"}`}
          style={{
            padding: "4px 8px",
            borderRadius: "8px",
            fontSize: "10px",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: isNeutral ? "#334155" : undefined,
            color: isNeutral ? "#cbd5e1" : undefined,
          }}
        >
          {isUp && <TrendingUp size={12} />}
          {isDown && <TrendingDown size={12} />}
          {isNeutral && <Minus size={12} />}
          {Math.abs(changePercent).toFixed(2)}%
        </div>
      </div>

      {/* PRICE */}
      <div
        className="price-display"
        style={{
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "6px",
        }}
      >
        <p
          style={{
            fontSize: "24px",
            fontWeight: 900,
            color: changeColor, // Changed from "white" to changeColor
            lineHeight: 1,
            transition: "color 0.3s ease", // Smooth transition when color changes
          }}
        >
          ₹{price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </p>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span
            style={{ color: changeColor, fontSize: "13px", fontWeight: 800 }}
          >
            {/* Logic to show + for up and - for down correctly */}
            {isUp ? "+" : isDown ? "-" : ""}₹{Math.abs(changeValue).toFixed(2)}
          </span>

          <span
            style={{ color: changeColor, fontSize: "13px", fontWeight: 800 }}
          >
            ({isUp ? "+" : isDown ? "-" : ""}
            {Math.abs(changePercent).toFixed(2)}%)
          </span>
        </div>

        {lastUpdated && (
          <p style={{ fontSize: "10px", color: "#94a3b8" }}>
            Last Tick: {new Date(lastUpdated).toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* QTY */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          marginTop: "18px",
        }}
      >
        <div>
          <p className="label-xs" style={{ fontSize: "11px", fontWeight: "bold", margin: 0 }}>Order Quantity</p>
          <p style={{ fontSize: "10px", color: "#475569", fontWeight: 700, margin: 0 }}>
            Limit: 50 Units
          </p>
        </div>

        <div className="qty-control" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
           className="unit-btn border-r"
            
            onClick={() => setQty(Math.max(1, qty - 1))}
          >
            <Minus size={16} strokeWidth={3} />
          </button>

          <span
            style={{
              width: "30px",
              textAlign: "center",
              fontWeight: 900,
              fontSize: "18px",
              color: "white",
            }}
          >
            {qty}
          </span>

          <button
            className="unit-btn border-l"
            onClick={() => setQty(Math.min(50, qty + 1))}
          >
            <Plus size={16} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* PAYABLE */}
      <div className="payable-summary" style={{ background: "#1e293b", padding: "12px", borderRadius: "8px", marginBottom: "15px" }}>
        <p className="label-xs" style={{ color: "#3b82f6", fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>
          Total Payable
        </p>
        <p style={{ fontSize: "24px", fontWeight: 900, color: "white", margin: 0 }}>
          ₹{(qty * price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </p>
      </div>

      {buying ? (
        <LoaderStatusButton loading={buying} text="Processing" />
      ) : (
        <button 
          className="execute-btn" 
          onClick={handleExecute}
          style={{
            width: "100%",
            padding: "12px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          EXECUTE BUY
        </button>
      )}
    </div>
  );
};

export default InvestmentCard;

const LoaderStatusButton = ({  text = "Submit" }) => {
  return (
    <>
      <style>{`
        .ls-btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 14px;
          border: none;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          background: #2563eb;
          color: white;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <button className="ls-btn" disabled>
        <Loader2 size={18} className="spin" />
        {text}...
      </button>
    </>
  );
};