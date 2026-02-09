import React, { useState, useEffect, useRef } from "react";
import { getRandomUPI, qRrandom, rechargeBalence, SECRET_KEY } from "../api";
import { useLocation, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import pako from "pako";
import {
  ArrowLeft,
  Clock,
  ShieldCheck,
  Zap,
  Copy,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Smartphone,
  Info,
} from "lucide-react";
import { Footer } from "./footer";

const THEME = {
  bg: "#020617",
  surface: "#0f172a",
  card: "#1e293b",
  border: "#334155",
  cyan: "#22d3ee",
  blue: "#3b82f6",
  white: "#f8fafc",
  textDim: "#94a3b8",
  textMute: "#64748b",
  error: "#ef4444",
  success: "#10b981",
};

const App = () => {
  const QRCode = async () => {
    const res = await qRrandom();
    if (!res.ok) return;
    const selectedItem = await res.json();
    console.log(selectedItem);
    return {
      filename: selectedItem.filename,
      url: selectedItem.url,
    };
  };
  const location = useLocation();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [qrImageName, setQrImageName] = useState("");
  const [upiId, setupiId] = useState("Q065208051@ybl");
  const [payeeName, setPayeeName] = useState("Guest Name");
  const [utr, setUtr] = useState("");
  // Mocking navigation/location logic since it's a single-file environment
  const price = location.state ?? 0;// Default or from state
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(300);
  const [message, setMessage] = useState({ text: "", type: "" });
  const timerRef = useRef(null);
  const [user, setuser] = useState(null);
  const navigate = useNavigate();
  // --- Core Logic (Adapted from your provided code) ---
  const fetchQRCode = async () => {
    setMessage({ text: "Fetching latest QR code...", type: "info" });
    try {
      const data = await QRCode();
      setQrCodeUrl(data.url);
      setQrImageName(data.filename);
      setMessage({
        text: "QR Code loaded. Please complete payment within 1 minute.",
        type: "info",
      });
    } catch (error) {
      console.log(error);
      setMessage({
        text: "Failed to load QR code. Please refresh.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const getUserData = async () => {
    const encryptedUser = Cookies.get("tredingWebUser");
    if (encryptedUser) {
      const base64 = encryptedUser.replace(/-/g, "+").replace(/_/g, "/");

      // 🔹 3. AES decrypt (gives compressed Base64 string)
      const decryptedBase64 = CryptoJS.AES.decrypt(base64, SECRET_KEY).toString(
        CryptoJS.enc.Utf8,
      );
      if (!decryptedBase64) return null;

      // 🔹 4. Convert Base64 → Uint8Array (binary bytes)
      const binaryString = atob(decryptedBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // 🔹 5. Decompress (restore JSON string)
      const decompressed = pako.inflate(bytes, { to: "string" });
      const data = await JSON.parse(decompressed);
      setuser(data);
      setIsLoading(true);
      if (!data?._id) navigate("/login");
    }
  };

  const currency = "INR";

  const isMobileDevice = () =>
    /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  const initiatePayment = (appName) => {
    let currentAmount = String(price).trim();

    if (!upiId) {
      setMessage({ text: "UPI ID is missing. Cannot proceed.", type: "error" });
      return;
    }

    if (!currentAmount || parseFloat(currentAmount) <= 0) {
      currentAmount = "1.00"; // default minimum amount
    }

    const formattedAmount = parseFloat(currentAmount).toFixed(2);
    const transactionNote = `Recharge for User ${user?._id || "Guest"} via ${appName}`;

    // ✅ Prepare URL Params
    const params = new URLSearchParams();
    params.append("pa", upiId);
    params.append("pn", payeeName);
    params.append("am", formattedAmount);
    params.append("cu", currency);
    params.append("tn", transactionNote);

    // ✅ Handle Paytm separately using Intent-based scheme
    if (appName === "Paytm") {
      const intentUrl = `intent://upi/pay?${params.toString()}#Intent;scheme=paytm;package=net.one97.paytm;end;`;

      if (isMobileDevice()) {
        console.log("Opening Paytm Intent:", intentUrl);

        window.location.href = intentUrl;

        // Fallback after 2.5s
        setTimeout(() => {
          setMessage({
            text: "Paytm app not detected. Opening Paytm website...",
            type: "info",
          });
          window.open("https://paytm.com/", "_blank");
        }, 2500);

        setMessage({
          text: `Opening Paytm app to pay ₹${formattedAmount}...`,
          type: "info",
        });
      } else {
        window.open("https://paytm.com/", "_blank");
        setMessage({
          text: "Opening Paytm website. Please scan QR or pay manually.",
          type: "info",
        });
      }

      return; // stop further execution
    }

    // ✅ PHONEPE and OTHER APPS
    let schemeBase;

    if (appName === "PhonePe") {
      schemeBase = "phonepe://pay?";
    } else {
      schemeBase = "upi://pay?";
    }

    const upiUrl = schemeBase + params.toString();

    if (isMobileDevice()) {
      console.log(`Trying to open ${appName}: ${upiUrl}`);

      window.location.href = upiUrl;

      // Fallback if app not found
      setTimeout(() => {
        setMessage({
          text: `${appName} not detected. Opening website instead...`,
          type: "info",
        });

        if (appName === "PhonePe")
          window.open("https://www.phonepe.com/", "_blank");
      }, 2500);

      setMessage({
        text: `Opening ${appName} app to pay ₹${formattedAmount}...`,
        type: "info",
      });
    } else {
      // ✅ Desktop Fallback
      let fallbackUrl = "";

      if (appName === "PhonePe") fallbackUrl = "https://www.phonepe.com/";

      if (fallbackUrl) {
        window.open(fallbackUrl, "_blank");
        setMessage({
          text: `Opening ${appName} website. Please scan QR or pay manually.`,
          type: "info",
        });
      } else {
        setMessage({
          text: "Could not determine redirect URL.",
          type: "error",
        });
      }
    }
  };

  const GetUPI = async () => {
    const res = await getRandomUPI();
    console.log(res);
    if (res.success) {
      setupiId(res?.data?.upiId || "Q065208051@ybl");
      setPayeeName(res?.data?.payeeName || "Guest Name");
    }
  };

  const copyToClipboard = (text) => {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setMessage({ text: "UPI ID Copied to Clipboard", type: "info" });
    setTimeout(() => setMessage({ text: "", type: "" }), 2000);
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
     if (isLoading) return;
    setIsLoading(true);

    setMessage({ text: "Submitting UTR for verification...", type: "info" });
    try {
      const payload = { userId: user?._id, amount: price, utr, qrImageName };
   
      const res = await rechargeBalence(payload);

      if (!res.status) throw new Error("Payment request failed");

      setMessage({
        text: "Payment submitted successfully! Awaiting approval.",
        type: "success",
      });
      setUtr("");
      setTimeout(() => navigate(-1), 1000);
    } catch (error) {
      setMessage({
        text: `Submission failed: ${error.message || "Server error."}`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 🚀 Initial setup
  useEffect(() => {
    GetUPI();
    getUserData();
    fetchQRCode();
    setTimer(300);
  }, []);

  // ⏱ Countdown effect
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  // 🔁 When timer hits 0, fetch new QR and reset timer
  useEffect(() => {
    if (timer === 0) {
      GetUPI();
      fetchQRCode(); // fetch new QR
      setTimer(300); // restart countdown
    }
  }, [timer]);
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <div className="gateway-container">
      {/* Background Decor */}
      <div className="glow-orb"></div>

      {/* Header */}
      <header className="nav-bar">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div className="nav-center">
          <span className="nav-brand">Recharge</span>
        </div>
        <div className="secure-badge">
          <ShieldCheck size={14} /> 
        </div>
      </header>

      <main className="content">
        {/* Amount Card */}
        <section className="amount-card">
          <div className="price-tag">
            <span className="currency">₹</span>
            <span className="value">{price.toLocaleString()}</span>
          </div>
          <h2>Use Mobile Scan Code to Pay</h2>
          <div className="payment-status">
            <p>Or take screenshot and scan in your payment app.</p>
          </div>

          <span>
            QR will expire in{" "}
            <strong className="timer-text">
              {" "}
              <Clock size={14} className="pulse" /> {minutes}:
              {seconds.toString().padStart(2, "0")} Minutes Left
            </strong>
          </span>
        </section>

        {/* Action Choice */}
        <div className="section-label">PAY VIA INSTALLED APP</div>
        <div className="app-grid">
          <button className="app-btn" onClick={() => initiatePayment("Paytm")}>
            <div className="app-icon paytm"></div>
            <span>Paytm</span>
          </button>
          <button
            className="app-btn"
            onClick={() => initiatePayment("PhonePe")}
          >
            <div className="app-icon phonepe"></div>
            <span>PhonePe</span>
          </button>
        </div>

        {/* QR Section */}
        <section className="qr-container">
          <div className="qr-header">
            <Smartphone size={16} />
            <h3>SCAN QR CODE</h3>
          </div>

          <div className="qr-box">
            <img src={qrCodeUrl} alt="Payment QR" className="qr-image" />
            <div className="qr-corners">
              <div className="corner tl"></div>
              <div className="corner tr"></div>
              <div className="corner bl"></div>
              <div className="corner br"></div>
            </div>
          </div>

          <div className="upi-display" onClick={() => copyToClipboard(upiId)}>
            <div className="upi-info">
              <span className="upi-label">UPI ID</span>
              <span className="upi-value">{upiId}</span>
            </div>
            <Copy size={16} className="copy-icon" />
          </div>

          <div className="warning-box">
            <AlertCircle size={14} />
            <span>Do not refresh or use this QR for multiple payments.</span>
          </div>
        </section>

        {/* UTR Verification */}
        <section className="utr-card">
          <div className="utr-header">
            <Info size={16} />
            <h3>SUBMIT REFERENCE</h3>
          </div>
          <p className="utr-hint">
            Enter the 12-digit UTR / Ref No. after payment
          </p>

          <form className="utr-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Ex: 4125XXXXXXXX"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                maxLength={12}
              />
              <Zap size={16} className="input-icon" />
            </div>

            <button
              type="submit"
              className={`submit-btn ${isLoading ? "loading" : ""}`}
              disabled={isLoading || utr.length < 6}
            >
              {isLoading ? <Loader2 className="spin" /> : "VERIFY TRANSACTION"}
            </button>
          </form>

          {message.text && (
            <div className={`status-msg ${message.type}`}>
              {message.type === "success" ? (
                <CheckCircle2 size={16} />
              ) : (
                <Zap size={16} />
              )}
              <span>{message.text}</span>
            </div>
          )}
        </section>

        {/* Instructions */}
        <section className="guide-panel">
          <h4>PAYMENT PROTOCOL</h4>
          <ul>
            <li>Open your payment app and scan the generated QR.</li>
            <li>
              Confirm the payee name matches: <strong>{payeeName}</strong>
            </li>
            <li>Once successful, copy the UTR number from history.</li>
            <li>Paste it above and wait for network confirmation.</li>
          </ul>
        </section>
      </main>
 <Footer/>
     

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@700&display=swap');

        :root {
          color-scheme: dark;
        }

        .gateway-container {
          min-height: 100vh;
          background: ${THEME.bg};
          color: ${THEME.white};
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          overflow-x: hidden;
          padding-bottom: 40px;
        }

        .glow-orb {
          position: absolute;
          width: 100%;
          height: 400px;
          background: ${THEME.blue};
          filter: blur(160px);
          opacity: 0.15;
          top: -100px;
          left: 0;
          pointer-events: none;
        }

        .nav-bar {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid ${THEME.border};
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-center {
          text-align: center;
        }

        .nav-brand {
          display: block;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 1px;
          color: ${THEME.white};
        }

        .nav-subtitle {
          font-size: 9px;
          color: ${THEME.cyan};
          font-weight: 700;
        }

        .secure-badge {
          background: rgba(34, 211, 238, 0.1);
          color: ${THEME.cyan};
          font-size: 10px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .content {
          width: 100%;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-sizing: border-box;
        }

        .amount-card {
          background: linear-gradient(135deg, ${THEME.surface}, #1e293b);
          border: 1px solid ${THEME.border};
          border-radius: 24px;
          padding: 24px;
          text-align: center;
          width: 100%;
          box-sizing: border-box;
        }

        .price-tag {
          display: flex;
          justify-content: center;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 8px;
        }

        .currency {
          font-size: 18px;
          font-weight: 700;
          color: ${THEME.cyan};
        }

        .value {
          font-size: 42px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .payment-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          color: ${THEME.textDim};
        }

        .timer-text {
          color: ${THEME.cyan};
          font-family: 'JetBrains Mono', monospace;
        }

        .section-label {
          font-size: 10px;
          font-weight: 800;
          color: ${THEME.textMute};
          letter-spacing: 1.5px;
          padding-left: 4px;
        }

        .app-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          width: 100%;
        }

        .app-btn {
          background: ${THEME.surface};
          border: 1px solid ${THEME.border};
          padding: 14px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
          box-sizing: border-box;
        }

        .app-btn:active {
          transform: scale(0.96);
          background: ${THEME.card};
        }

        .app-icon {
          width: 32px;
          height: 32px;
          background-size: cover;
          border-radius: 8px;
        }

        .app-icon.paytm { background-image: url('https://img.icons8.com/?size=100&id=zB8j6RfneRmV&format=png&color=000000'); }
        .app-icon.phonepe { background-image: url('https://pay.topcashwallet.com/assets/qr_phonepe-DfcDrNXK.png'); }

        .qr-container {
          background: ${THEME.surface};
          border: 1px solid ${THEME.border};
          border-radius: 24px;
          padding: 24px;
          text-align: center;
          width: 100%;
          box-sizing: border-box;
        }

        .qr-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .qr-header h3 {
          font-size: 12px;
          font-weight: 800;
          color: ${THEME.cyan};
          letter-spacing: 1px;
          margin: 0;
        }

        .qr-box {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 0 auto 20px;
          padding: 10px;
          background: white;
          border-radius: 12px;
        }

        .qr-image {
          width: 100%;
          height: 100%;
          display: block;
        }

        .corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 3px solid ${THEME.cyan};
        }
        .tl { top: -4px; left: -4px; border-right: 0; border-bottom: 0; }
        .tr { top: -4px; right: -4px; border-left: 0; border-bottom: 0; }
        .bl { bottom: -4px; left: -4px; border-right: 0; border-top: 0; }
        .br { bottom: -4px; right: -4px; border-left: 0; border-top: 0; }

        .upi-display {
          background: ${THEME.bg};
          border: 1px dashed ${THEME.border};
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          cursor: pointer;
          width: 100%;
          box-sizing: border-box;
        }

        .upi-info { text-align: left; }
        .upi-label { display: block; font-size: 8px; color: ${THEME.textMute}; font-weight: 800; }
        .upi-value { font-size: 13px; font-weight: 700; color: ${THEME.white}; }

        .warning-box {
          display: flex;
          gap: 8px;
          color: ${THEME.error};
          font-size: 10px;
          font-weight: 600;
          justify-content: center;
          align-items: center;
        }

        .utr-card {
          background: ${THEME.surface};
          border: 1px solid ${THEME.border};
          border-radius: 24px;
          padding: 24px;
          width: 100%;
          box-sizing: border-box;
        }

        .utr-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .utr-header h3 { font-size: 12px; color: ${THEME.white}; margin: 0; }
        .utr-hint { font-size: 11px; color: ${THEME.textDim}; margin-bottom: 16px; }

        .input-wrapper {
          position: relative;
          margin-bottom: 12px;
          width: 100%;
        }

        .input-wrapper input {
          width: 100%;
          background: ${THEME.bg};
          border: 1px solid ${THEME.border};
          border-radius: 12px;
          padding: 14px 44px 14px 16px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          outline: none;
          box-sizing: border-box;
        }

        .input-wrapper input:focus {
          border-color: ${THEME.cyan};
        }

        .input-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: ${THEME.textMute};
        }

        .submit-btn {
          width: 100%;
          background: ${THEME.cyan};
          color: ${THEME.bg};
          border: none;
          padding: 16px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .status-msg {
          margin-top: 12px;
          padding: 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          box-sizing: border-box;
        }
        .status-msg.info { background: rgba(34, 211, 238, 0.1); color: ${THEME.cyan}; }
        .status-msg.success { background: rgba(16, 185, 129, 0.1); color: ${THEME.success}; }

        .guide-panel {
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }

        .guide-panel h4 { font-size: 10px; color: ${THEME.textMute}; margin-bottom: 12px; letter-spacing: 1px; }
        .guide-panel ul { padding: 0; margin: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .guide-panel li { font-size: 11px; color: ${THEME.textDim}; line-height: 1.4; position: relative; padding-left: 14px; }
        .guide-panel li::before { content: ""; position: absolute; left: 0; top: 6px; width: 4px; height: 4px; background: ${THEME.border}; border-radius: 50%; }

        .secure-footer {
          text-align: center;
          padding-top: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 9px;
          font-weight: 800;
          color: ${THEME.textMute};
          width: 100%;
        }

        .pulse { animation: pulse 2s infinite; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .icon-btn { background: none; border: none; color: white; cursor: pointer; padding: 4px; }
      `}</style>
    </div>
  );
};

export default App;
