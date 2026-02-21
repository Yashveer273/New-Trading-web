import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ChevronRight, 
  Info, 
  ShieldCheck, 
  Zap,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { Footer } from './footer';

/**
 * Adani CluxTrade RECHARGE COMPONENT
 * Refined Blue-Themed Financial Interface
 */

const THEME = {
  bg: '#020617', // Deep Navy
  surface: '#0f172a', // Slate Blue
  card: '#1e293b', // Muted Blue
  border: '#334155', // Steel Blue
  cyan: '#22d3ee', // Primary Action Cyan
  electric: '#3b82f6', // Secondary Blue
  white: '#f8fafc',
  textDim: '#94a3b8',
  textMute: '#64748b',
};

const Recharge = () => {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const quickAmounts = [
    100, 200, 300, 500, 1000, 1200, 1500,
    2000, 2500, 3000, 4000, 5000,
  ];

  const explanations = [
    "Please do not modify the deposit amount. Unauthorized modification will result in the deposit not being credited.",
    "Each deposit requires payment to be initiated through this page. Do not save payment details locally.",
    "Deposits are verified within 5 minutes. If delayed, contact our encrypted support line.",
    "During high-load periods, if a link fails, attempt to re-generate the pay link or wait 2 minutes.",
  ];

  const handleRecharge = () => {
    if (!amount || isNaN(amount) || amount <= 0) return;
    setIsProcessing(true);
    navigate("/pay",{ state: amount })
  
  };

  return (
    <div className="recharge-view">
      {/* Dynamic Background Blur Elements */}
      <div className="bg-glow"></div>

      {/* Header */}
      <nav className="recharge-nav">
        <div className="nav-content">
          <button className="icon-btn" onClick={() => navigate(-1)}>
                     <ArrowLeft size={20} />
          </button>
          <div className="nav-title">
            <h1 className="title-text">Recharge</h1>
           
          </div>
          <div className="nav-icon">
            <Lock size={18} color={THEME.cyan} />
          </div>
        </div>
      </nav>

      <main className="recharge-main">
        {/* Balance Card */}
        <section className="balance-preview">
          <div className="preview-label">CURRENT LIQUIDITY</div>
          <div className="preview-value">₹124,500.80</div>
        </section>

        {/* Input Section */}
        <section className="input-card">
          <div className="label-row">
            <span className="field-label tracking-widest">TRANSACTION_VAL</span>
            <span className="currency-tag">INR</span>
          </div>
          
          <div className="amount-input-wrapper">
            <span className="currency-prefix">₹</span>
            <input
              type="number"
              placeholder="Enter Amount"
              className="main-amount-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="quick-grid">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                className={`grid-item ${amount == amt ? "active" : ""}`}
                onClick={() => setAmount(amt.toString())}
              >
                {amt}
              </button>
            ))}
          </div>

          <button 
            className={`action-button ${!amount ? 'disabled' : ''}`}
            onClick={handleRecharge}
            disabled={!amount || isProcessing}
          >
            {isProcessing ? (
              <span className="loading-content">
                <Zap size={18} className="spin" /> SYNCING...
              </span>
            ) : (
              <>
                RECHARGE ACCOUNT <ArrowUpRight size={18} />
              </>
            )}
          </button>
        </section>

        {/* Protocol Panel */}
        <section className="info-panel">
          <div className="info-header">
            <ShieldCheck size={16} color={THEME.cyan} />
            <h3>SECURITY PROTOCOLS</h3>
          </div>
          <div className="info-list">
            {explanations.map((text, i) => (
              <div key={i} className="info-item">
                <div className="item-marker"></div>
                <p className="item-text">{text}</p>
              </div>
            ))}
          </div>
        </section>

      
      </main>
 <Footer/>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@700;800&display=swap');

        .recharge-view {
          min-height: 100vh;
          background-color: ${THEME.bg};
          background-image: radial-gradient(circle at top right, rgba(34, 211, 238, 0.05), transparent);
          color: ${THEME.white};
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          position: relative;
        }

        .bg-glow {
          position: absolute;
          width: 300px;
          height: 300px;
          background: ${THEME.electric};
          filter: blur(150px);
          opacity: 0.1;
          top: 20%;
          left: -150px;
          pointer-events: none;
        }

        .recharge-nav {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid ${THEME.border};
          padding: 14px 20px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-content {
          max-width: auto;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .back-button {
          background: ${THEME.surface};
          border: 1px solid ${THEME.border};
          color: ${THEME.textDim};
       
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .nav-title {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .title-text {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 800;
          font-size: 14px;
          margin: 0;
          letter-spacing: 1.5px;
          color: ${THEME.white};
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 8px;
          font-weight: 900;
          color: ${THEME.cyan};
          letter-spacing: 1px;
        }

        .pulse-dot {
          width: 5px;
          height: 5px;
          background: ${THEME.cyan};
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }

        .recharge-main {
          max-width: auto;
          margin: 0 auto;
          width: 100%;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .balance-preview {
          background: linear-gradient(135deg, ${THEME.surface}, #1e293b);
          border: 1px solid ${THEME.border};
          border-radius: 20px;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .preview-label {
          font-size: 9px;
          font-weight: 800;
          color: ${THEME.textMute};
          letter-spacing: 1px;
        }

        .preview-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 15px;
          font-weight: 700;
          color: ${THEME.cyan};
        }

        .input-card {
          background: ${THEME.surface};
          border: 1px solid ${THEME.border};
          border-radius: 28px;
          padding: 24px;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
        }

        .label-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .field-label {
          font-size: 10px;
          font-weight: 800;
          color: ${THEME.textMute};
        }

        .amount-input-wrapper {
          position: relative;
          background: rgba(2, 6, 23, 0.4);
          border: 2px solid ${THEME.border};
          border-radius: 20px;
          display: flex;
          align-items: center;
          padding: 0 20px;
          margin-bottom: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .amount-input-wrapper:focus-within {
          border-color: ${THEME.cyan};
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.1);
          transform: translateY(-2px);
        }

        .currency-prefix {
          font-size: 20px;
          font-weight: 800;
          color: ${THEME.cyan};
          margin-right: 12px;
        }

        .main-amount-input {
          background: transparent;
          border: none;
          color: ${THEME.white};
          font-size: 28px;
          font-weight: 800;
          width: 100%;
          padding: 18px 0;
          outline: none;
          font-family: 'JetBrains Mono', monospace;
        }

        .quick-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 24px;
        }

        .grid-item {
          background: ${THEME.bg};
          border: 1px solid ${THEME.border};
          color: ${THEME.textDim};
          padding: 12px 0;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .grid-item.active {
          background: ${THEME.cyan};
          border-color: ${THEME.cyan};
          color: ${THEME.bg};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(34, 211, 238, 0.3);
        }

        .action-button {
          width: 100%;
          background: ${THEME.cyan};
          color: ${THEME.bg};
          border: none;
          padding: 18px;
          border-radius: 18px;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 0.5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s ease;
        }

        .action-button.disabled {
          background: ${THEME.border};
          color: ${THEME.textMute};
          opacity: 0.6;
          cursor: not-allowed;
        }

        .info-panel {
          background: linear-gradient(to bottom right, rgba(34, 211, 238, 0.05), transparent);
          border: 1px solid ${THEME.border};
          border-radius: 24px;
          padding: 20px;
        }

        .info-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .info-header h3 {
          margin: 0;
          font-size: 11px;
          font-weight: 800;
          color: ${THEME.cyan};
          letter-spacing: 1px;
        }

        .info-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-item {
          display: flex;
          gap: 12px;
        }

        .item-marker {
          width: 4px;
          height: 4px;
          background: ${THEME.cyan};
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .item-text {
          margin: 0;
          font-size: 11px;
          line-height: 1.5;
          color: ${THEME.textDim};
        }

        .recharge-footer {
          margin-top: auto;
          padding: 30px 20px;
          display: flex;
          justify-content: center;
        }

        .encryption-label {
          display: flex;
          align-items: center;
          gap: 10px;
          color: ${THEME.textMute};
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .bits {
          background: ${THEME.border};
          padding: 2px 6px;
          border-radius: 4px;
          color: ${THEME.cyan};
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default Recharge;