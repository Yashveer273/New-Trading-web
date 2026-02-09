import React, { useState, useEffect } from "react";
import "./styles/account.css";
import {
  CheckCircle2,
  Shield,
  CreditCard,
  User,
  Smartphone,
  Mail,
  Fingerprint,
} from "lucide-react";
import Navigation from "./components/Navigation";
import { Footer } from "./components/footer";
import { useNavigate } from "react-router-dom";
import { fetchUserData, getUserData, getUserInfo, sellProduct } from "./api";
import AssetPerformanceList from "./AssetPerformanceList";

const Account = () => {
  const navigate = useNavigate();

  // ✅ NEVER NULL — prevents UI crash
  const [userData, setUserData] = useState({
    balance: 0,
    Withdrawal: 0,
    totalBuy: 0,
    phone: "",
    _id: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [purchasesWithStock, setpurchasesWithStock] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  // ✅ SAFE USER FETCH
  const userdata = async () => {
    try {
      const data = await getUserData();
      if (!data?._id) throw new Error("No user id");

      const userRes = await getUserInfo(data._id);
      if (!userRes?.data?.success) throw new Error("Unauthorized");

      setIsLoggedIn(true);
      setUserData({
        balance: userRes.data.user?.balance ?? 0,
        Withdrawal: userRes.data.user?.Withdrawal ?? 0,
        totalBuy: userRes.data.user?.totalBuy ?? 0,
        phone: userRes.data.user?.phone ?? "",
        _id: userRes.data.user?._id ?? "",
      });

      const purchaseRes = await fetchUserData(data._id);
      setpurchasesWithStock(purchaseRes?.purchases || []);
    } catch (err) {
      console.log("User fetch failed:", err.message);

      // 🔥 Keep UI safe
      setIsLoggedIn(false);
      setUserData({
        balance: 0,
        Withdrawal: 0,
        totalBuy: 0,
        phone: "",
        _id: "",
      });
      setpurchasesWithStock([]);
    }
  };

  useEffect(() => {
    userdata();
  }, []);

  const handleBuy = async (asset, units) => {
    if (!isLoggedIn || !userData?._id) {
      showToast("Please login first");
      navigate("/login");
      return;
    }

    try {
      setIsProcessing(true);

      if (asset.leftStockUnits < 1) {
        showToast("No stock units available to sell");
        return;
      }

      const res = await sellProduct({
        purchaseId: asset.purchaseId,
        leftStockUnits: asset.leftStockUnits,
        stockId: asset.stockId,
        units,
        userId: userData._id,
      });

      if (res?.data?.success) {
        showToast(res.data.message);
        await userdata();
      } else {
        showToast("Transaction failed");
      }
    } catch (err) {
      console.log(err);
      showToast("Transaction failed");
    } finally {
      setTimeout(() => setIsProcessing(false), 1500);
    }
  };

  return (
    <div className="v-terminal">
      <Navigation />

      <main className="v-container">
        <div className="v-stack">
          <div className="v-unit">
            <div className="v-unit-head">
              <span className="v-unit-label">PORTFOLIO OVERVIEW</span>
              <Shield size={16} className="v-mute" />
            </div>
            <div className="v-unit-body">
              <div className="v-big-balance">
                <span className="v-curr">₹</span>
                <span className="v-val">
                  {isLoggedIn ? userData.balance : "0"}
                </span>
              </div>
              <div className="v-btn-row">
                <button
                  className="v-btn-primary"
                  onClick={() => navigate("/recharge")}
                >
                  DEPOSIT
                </button>
                <button className="v-btn-dark">WITHDRAW</button>
              </div>
            </div>
          </div>

          <div className="v-unit">
            <div className="v-unit-head">
              <span className="v-unit-label">
                <User size={16} className="v-mute" /> USER PROFILE
              </span>
              <span className="v-unit-label">
                User Id:- {isLoggedIn ? userData._id : ""}
              </span>
            </div>

            <div className="v-id-grid">
              <div className="v-id-item">
                <span className="v-id-label">WITHDRAWAL</span>
                <div className="v-flex-between">
                  <span className="v-id-val">
                    {isLoggedIn ? `₹${userData.Withdrawal}` : "NOT AUTHENTICATED"}
                  </span>
                  <Fingerprint size={14} className="v-text-mute" />
                </div>
              </div>

              <div className="v-id-item">
                <span className="v-id-label">TOTAL BUY</span>
                <div className="v-flex-between">
                  <span className="v-id-val">
                    {isLoggedIn ? `₹${userData.totalBuy}` : "0"}
                  </span>
                  <Mail size={14} className="v-text-mute" />
                </div>
              </div>

              <div className="v-id-item">
                <span className="v-id-label">MOBILE NUMBER</span>
                <div className="v-flex-between">
                  <span className="v-id-val">
                    {isLoggedIn ? `+91 ${userData.phone}` : "---"}
                  </span>
                  <Smartphone size={14} className="v-text-mute" />
                </div>
              </div>

              <div
                className="v-id-item v-clickable-id"
                onClick={() => isLoggedIn}
              >
                <span className="v-id-label">Account</span>
                <div className="v-flex-between">
                  <span className=" v-cyan">My Portfolio</span>
                  <CreditCard size={14} className="v-cyan" />
                </div>
              </div>
            </div>
          </div>

          <AssetPerformanceList
            purchasesWithStock={purchasesWithStock}
            onBuy={handleBuy}
            isProcessing={isProcessing}
          />
        </div>
      </main>

      <div className={`v-toast ${toast.show ? "v-visible" : ""}`}>
        <CheckCircle2 size={18} />
        <span>{toast.message}</span>
      </div>

      <Footer />
    </div>
  );
};

export default Account;
