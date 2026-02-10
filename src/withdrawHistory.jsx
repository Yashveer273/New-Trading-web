import React from "react";
import { Clock, CheckCircle, XCircle, Copy, ArrowLeft } from "lucide-react";
import "./withdrawHistory.css";
import { useLocation, useNavigate } from "react-router-dom";


const copyToClipboard = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    console.log("Text copied to clipboard:", text);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
  document.body.removeChild(textarea);
};

// --- Mock Data (Aligned with the user's Mongoose Schema structure) ---

// Component for a single Withdrawal List Item
const WithdrawalItem = ({ record }) => {
  // Use record.status, and capitalize it for display
  const statusDisplay =
    record.status.charAt(0).toUpperCase() + record.status.slice(1);
  const statusClass = `status-${statusDisplay}`; // e.g., status-Pending

  
  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      console.log(e);
      return "Invalid Date";
    }
  };

  const getStatusIcon = (status) => {
    console.log(record)
    switch (status) {
      case "approved":
        return <CheckCircle style={{ width: "1rem", height: "1rem" }} />;
      case "rejected":
        return <XCircle style={{ width: "1rem", height: "1rem" }} />;
      case "pending":
      default:
        return <Clock style={{ width: "1rem", height: "1rem" }} />;
    }
  };

  return (
    <div className="withdrawal-item">
      <div className="withdrawal-header">
        {/* Amount */}
        <div className="withdrawal-amount">
          ₹{record.amount.toLocaleString("en-IN")}
        </div>

        {/* Status Badge - uses capitalized status for the class names */}
        <div className={`withdrawal-status ${statusClass}`}>
          {getStatusIcon(record.status)} {statusDisplay}
        </div>
      </div>

      {/* Date Row */}
      <div className="withdrawal-info-row">
        <span>Create Date:</span>
        <span className="withdrawal-info-value">{formatDate(record.timestamp)}</span>
      </div>

      <div className="withdrawal-info-row">
        <span>Transection ID:</span>
        <div className="utr-copy-group">
          <span className="utr-text">{record._id.slice(0,5)}...</span>
          <button
            onClick={() => copyToClipboard(record._id)}
            className="copy-btn"
            title="Copy Reference ID"
            style={{ color: "var(--bright-orange)" }}
          >
            <Copy style={{ width: "0.8rem", height: "0.8rem" }} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Component for the Withdrawal History list view
const WithdrawalHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const data = location.state || [];
  console.log(data);
 

  const type = "Withdraw History";

  return (
    <div className="app-container">
      {" "}
  
      <div className="maincontent">
        {" "}
    
        <div className="header">
      
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft className="chevron-icon" />
          </button>
          <div className="header-title-group">
            <h2>{type} </h2>
          
          
              
            
          </div>
        </div>
 
        <div className=" withdrawal-history-list">
          {data.length > 0 ? (
            data.map((record, index) => (
              <WithdrawalItem key={index} record={record} />
            ))
          ) : (
            <p className="no-records-message">No withdrawal records found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawalHistory;
