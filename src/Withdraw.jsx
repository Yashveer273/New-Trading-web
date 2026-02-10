import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,

  Loader2,

  Plus,
} from "lucide-react";
import "./Withdraw.css";
import {
  addBankDetails,
  getBankDetails,
  SECRET_KEY,
  getUserInfo,
  getUserData,
  updateBankDetails,
  withdrawReq,
} from "./api";



const Withdraw = () => {
  const navigate = useNavigate();
  const [bankDetails, setBankDetails] = useState(null);
  const [hasBankDetails, setHasBankDetails] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [userId, setUserId] = useState("user_123");
  const [holderName, setHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [upiId, setUpiId] = useState("");

  const [tradePassword, setTradePassword] = useState("");
  const [BUpTRadePassword, setBUpTRadePassword] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [responseMessage, setResponseMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
 
   const userdata = async () => {
     try {
       const data = await getUserData();
       if (!data?._id) throw new Error("No user id");
 setUserId(data?._id);
       const userRes = await getUserInfo(data._id);
       if (!userRes?.data?.success) throw new Error("Unauthorized");
 
     
       setBalance(userRes.data.user?.Withdrawal ?? 0,);
return data?._id;
     } catch (err) {
       console.log("User fetch failed:", err.message);
     }
   };

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const id = await userdata();
        const res = await getBankDetails(id);

        if (
          res.data.bankDetails &&
          Object.keys(res.data.bankDetails).length > 0
        ) {
          setHasBankDetails(true);
          setBankDetails(res.data.bankDetails);
          setHolderName(res.data.bankDetails.holderName || "");
          setAccountNumber(res.data.bankDetails.accountNumber || "");
          setIfscCode(res.data.bankDetails.ifscCode || "");
          setBankName(res.data.bankDetails.bankName || "");
          setUpiId(res.data.bankDetails.upiId || "");
          setBalance(res.data.Withdrawal || 0);
        } else {
          setHasBankDetails(false);
          setBalance(res.data.Withdrawal || 0);
        }
      } catch (err) {
        setResponseMessage({
          type: "error",
          message:
            err.response?.data?.message || "Failed to fetch bank details",
        });
      }
    };
    
    fetchBankDetails();
  }, []);
  const handleAddBank = async () => {
    if (!holderName || !accountNumber || !ifscCode || !bankName)
      return alert("Fill all required fields");
    try {
      setIsLoading(true);
      const res = await addBankDetails({
        userId,
        holderName,
        accountNumber,
        ifscCode,
        bankName,
        upiId,
      });
      setHasBankDetails(true);

      setBankDetails(res?.bankDetails);
      setIsAdding(false);
      setResponseMessage({ type: "success", message: res.message });
    } catch (err) {
      setResponseMessage({
        type: "error",
        message: err.response?.message || "Failed to add bank details",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBank = async () => {
    if (!BUpTRadePassword)
      return alert("Enter trade password to update bank details");
    try {
      setIsLoading(true);
      const res = await updateBankDetails({
        userId,
        tradePassword: BUpTRadePassword,
        bankDetails: { holderName, accountNumber, ifscCode, bankName, upiId },
      });

      setBankDetails(res?.data?.bankDetails);
      setResponseMessage({ type: "success", message: res.data.message });
      setBUpTRadePassword("");
      setIsEditing(false); // ✅ exit edit mode
    } catch (err) {
      setResponseMessage({
        type: "error",
        message: err.response?.data?.message || "Bank update failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!withdrawalAmount || !tradePassword)
      return alert("Enter amount and trade password");
    try {
      setIsLoading(true);
      const res = await withdrawReq({
        userId,
        tradePassword,
        amount: withdrawalAmount,
        bankDetails,
      });
      setBalance((prev) => prev - withdrawalAmount);
      setTradePassword("");
      setWithdrawalAmount("");
      setResponseMessage({ type: "success", message: res.data.message });
    } catch (err) {
      console.log(err.message);
      setResponseMessage({
        type: "error",
        message: err.message || "Withdrawal failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="withdraw-page">
      <div className="header2">
        <button className="back-btnR" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} color="#58a6ff" />
        </button>
        <h1 className="header-title">Withdraw</h1>
      </div>

      <div className="main-content">
        <div className="card0">
          <div className="balance-info">
            <span className="balance-label">Available Balance</span>
            <span className="balance-amount">
              ₹ {balance.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="input-group">
            {responseMessage && (
              <div className={`response-card ${responseMessage.type}`}>
                {responseMessage.message}
              </div>
            )}

            {/* Bank Management Section */}
            {!hasBankDetails ? (
              !isAdding ? (
                <button
                  className="apply-button"
                  onClick={() => setIsAdding(true)}
                >
                  <Plus size={16} /> Add Bank Details
                </button>
              ) : (
                <div className="input-group">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Holder Name"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                  />
                  <input
                    type="number"
                    className="input-field"
                    placeholder="Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="IFSC Code"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Bank Name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="UPI ID (Optional)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <div className="btn-group">
                    <button
                      className="apply-button"
                      style={{ flex: 1 }}
                      onClick={() => {
                        handleAddBank();
                      }}
                    >
                      Save
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() => setIsAdding(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="bank-details-box">
                <div
                  className="section-tag"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#8b949e",
                    }}
                  >
                    MY BANK DETAILS
                  </span>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#58a6ff",
                        fontSize: "11px",
                        cursor: "pointer",
                      }}
                    >
                      Edit Details
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="input-group">
                    <input
                      type="text"
                      className="input-field"
                      value={holderName}
                      onChange={(e) => setHolderName(e.target.value)}
                      placeholder="Holder Name"
                    />
                    <input
                      type="number"
                      className="input-field"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Account Number"
                    />
                    <input
                      type="text"
                      className="input-field"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      placeholder="IFSC Code"
                    />
                    <input
                      type="text"
                      className="input-field"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="Bank Name"
                    />
                    <input
                      type="text"
                      className="input-field"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="UPI ID (Optional)"
                    />
                    <input
                      type="password"
                      style={{ marginTop: "8px", borderColor: "#f85149" }}
                      className="input-field"
                      placeholder="Confirm Trade Password"
                      value={BUpTRadePassword}
                      onChange={(e) => setBUpTRadePassword(e.target.value)}
                    />
                    <div className="btn-group">
                      <button
                        className="apply-button"
                        onClick={handleUpdateBank}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="spin" size={16} />
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                      <button
                        className="cancel-button"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bank-info-item">
                      <span className="info-label">Holder</span>
                      <span className="info-value">
                        {bankDetails.holderName}
                      </span>
                    </div>
                    <div className="bank-info-item">
                      <span className="info-label">Account</span>
                      <span className="info-value">
                        **** {bankDetails.accountNumber.slice(-4)}
                      </span>
                    </div>
                    <div className="bank-info-item">
                      <span className="info-label">IFSC</span>
                      <span className="info-value">{bankDetails.ifscCode}</span>
                    </div>
                    <div className="bank-info-item">
                      <span className="info-label">Bank</span>
                      <span className="info-value">{bankDetails.bankName}</span>
                    </div>
                    {bankDetails.upiId && (
                      <div className="bank-info-item">
                        <span className="info-label">UPI ID</span>
                        <span className="info-value">{bankDetails.upiId}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Withdrawal Form */}
            {hasBankDetails && !isEditing && (
              <div
                className="input-group"
                style={{ borderTop: "1px solid #30363d", paddingTop: "16px" }}
              >
                <div
                  style={{
                    marginBottom: "4px",
                    fontSize: "11px",
                    color: "#8b949e",
                    fontWeight: 700,
                  }}
                >
                  INITIATE WITHDRAWAL
                </div>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Enter Amount (Min. ₹300)"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                />
                <input
                  type="password"
                  className="input-field"
                  placeholder="Enter Trade Password"
                  value={tradePassword}
                  onChange={(e) => setTradePassword(e.target.value)}
                />
                <button
                  onClick={handleWithdrawal}
                  disabled={isLoading}
                  className="apply-button"
                >
                  {isLoading ? (
                    <Loader2 className="spin" size={18} />
                  ) : (
                    "Request Withdrawal"
                  )}
                </button>
              </div>
            )}

            <div className="explanation">
              <h2 className="explanation-title">Withdrawal Rules</h2>
              <ol className="rules-list">
                <li>Daily window: 00:00:00 to 23:59:59.</li>
                <li>Limits: ₹300 to ₹500,000 per request.</li>
                <li>Limit: Only one withdrawal allowed per day.</li>
                <li>Processing Fee: A standard rate of 5% applies.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
