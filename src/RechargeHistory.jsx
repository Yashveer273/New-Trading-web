import React from 'react';
import { Clock, CheckCircle, XCircle, Copy, ArrowLeft } from 'lucide-react';
import "./RechargeHistory.css"
import { useLocation,useNavigate } from "react-router-dom";
 

// Utility function for copying text (standard practice in these projects)
const copyToClipboard = (text) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy'); 
    console.log('Text copied to clipboard:', text);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
  document.body.removeChild(textarea);
};





// Component for a single Recharge List Item
const RechargeItem = ({ record }) => {
     console.log(record.approved)
    const statusClass = `status-${record.approved}`;
    
    // Format ISO date string into a readable format
    const formatDate = (isoString) => {
        try {
            const date = new Date(isoString);
            return date.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            console.log(e)
            return "Invalid Date";
        }
    };

    // Determine which icon to show based on the status
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved':
                return <CheckCircle style={{ width: '1rem', height: '1rem' }} />;
            case 'Rejected':
                return <XCircle style={{ width: '1rem', height: '1rem' }} />;
            case 'Pending':
            default:
                return <Clock style={{ width: '1rem', height: '1rem' }} />;
        }
    };

    return (
        <div className="recharge-item">
            <div className="recharge-header">
                {/* Amount */}
                <div className="recharge-amount">
                  
                    ₹{record.amount.toLocaleString('en-IN')}
                </div>
                
                {/* Status Badge */}
                <div className={`recharge-status ${statusClass}`}>
                    {getStatusIcon(record.approved)} {record.approved}
                </div>
            </div>
            
            {/* Date Row */}
            <div className="recharge-info-row">
                <span>Date:</span>
                <span className="recharge-info-value">{formatDate(record.date)}</span>
            </div>
            
            {/* UTR/Reference Number Row with Copy Button */}
            <div className="recharge-info-row">
                <span>UTR/Ref No:</span>
                <div className="utr-copy-group">
                    <span className="utr-text">{record.utr}</span>
                    <button
                        onClick={() => copyToClipboard(record.utr)}
                        className="copy-btn"
                        title="Copy UTR"
                        style={{ color: "#ff9900" }}
                    >
                        <Copy style={{ width: '0.8rem', height: '0.8rem' }} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Component for the Recharge History list view
const RechargeHistory = () => {
    const navigate=useNavigate();
    const location = useLocation();
      const data = location.state.data || [];
    const type = "Recharge History";
    
    return (
        <div>
            {/* Header */}
            <div className="header">
                {/* Note: This button is present for layout but doesn't navigate anywhere in this standalone file */}
                <button 
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="chevron-icon" />
                </button>
                 <div className="header-title-group">
                    <h2>{type} </h2>
                   
                    
                </div>

            </div>
            
            {/* List of Records */}
            <div className="content-padding recharge-history-list">
                {data.length > 0 ? (
                    data.map((record, index) => (
                        <RechargeItem key={index} record={record} />
                    ))
                ) : (
                    <p className="text-center text-gray-500">No recharge records found.</p>
                )}
            </div>
        </div>
    );
};




export default RechargeHistory;
