import React, { useState, } from 'react';
import "./styles/account.css";
import { 
  Bot, 
  FileText, 
  Cpu, 
  RadioReceiver, 
  UserCheck, 
  CheckCircle2, 
  Loader2, 
  ChevronRight, 
  Activity, 
  Check, 
  TrendingUp, 
  TrendingDown,
  LogOut,
  LogIn,
  Shield,
  Zap,
  Layers,
  XCircle,
  Database,
  Building2,
  ArrowLeft,
  CreditCard,
  User,
  Smartphone,
  Mail,
  Fingerprint
} from 'lucide-react';
import Navigation from './components/Navigation';
import { Footer } from './components/footer';
import { useNavigate } from 'react-router-dom';

const AssetPerformanceList = ({ assets, type, onSell, isInitialLoading }) => {
  const [sellingItems, setSellingItems] = useState({});

  if (isInitialLoading) {
    return (
      <div className="v-api-loading">
        <div className="v-loader-box">
          <Database size={32} className="v-pulse-icon" />
          <span className="v-loading-text">RETRIEVING DATA...</span>
          <div className="v-progress-track">
             <div className="v-progress-fill"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleSellClick = (item) => {
    if (sellingItems[item.id]) return;
    setSellingItems(prev => ({ ...prev, [item.id]: true }));
    
    setTimeout(() => {
      onSell(item.name, item.price);
      setSellingItems(prev => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  return (
    <div className="asset-feed">
      {assets.map((item) => {
        const isCanceled = item.id === 6;

        return (
          <div key={item.id} className="asset-node">
            <div className="node-glitch-line" style={{ background: item.color }}></div>
            
            <div className="node-main">
              <div className="node-icon-wrapper" style={{ border: `1px solid ${item.color}44` }}>
                <item.icon size={20} style={{ color: item.color }} />
              </div>

              <div className="node-info">
                <div className="node-meta">
                  <span className="node-tag">Trading Type</span>
                  <span className="node-category" style={{ color: item.color }}>
                    {type === 'pending' ? 'Verification' : (item.isProfit ? 'High Performance' : 'Standard')}
                  </span>
                </div>
                <h4 className="node-title">{item.name}</h4>
                <div className="node-price-row">
                  <span className="node-price">₹{item.price.toLocaleString('en-IN')}</span>
                  {type !== 'pending' && (
                    <div className={`node-stat ${item.isProfit ? 'pos' : 'neg'}`}>
                       {item.isProfit ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                       {item.change}
                    </div>
                  )}
                </div>
              </div>

              <div className="node-actions">
                {type === 'active' && (
                  <button 
                    className={`node-btn sell ${sellingItems[item.id] ? 'loading' : ''}`}
                    onClick={() => handleSellClick(item)}
                    disabled={sellingItems[item.id]}
                  >
                    {sellingItems[item.id] ? <Loader2 size={14} className="animate-spin" /> : "SELL"}
                  </button>
                )}

                {type === 'pending' && (
                  <div className={`node-status-badge ${isCanceled ? 'status-canceled' : 'status-received'}`}>
                    {isCanceled ? <XCircle size={14} /> : <Check size={14} />}
                    <span>{isCanceled ? 'CANCELED' : 'RECEIVED'}</span>
                  </div>
                )}

                {type === 'sold' && (
                  <div className="node-status-badge status-received">
                    <Check size={14} />
                    <span>COMPLETED</span>
                  </div>
                )}

                {type === 'active' && (
                  <button className="node-details">
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};



const Account = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
 
  const [activeTab, setActiveTab] = useState('active');
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const navigate = useNavigate();
  const products = {
    active: [
      { id: 1, name: "Nifty Alpha Trading Bot v2.0 Enterprise", price: 4500.00, change: "+12.5%", isProfit: true, icon: Bot, color: "#00d2ff" },
      { id: 2, name: "Options Mastery Guide Premium", price: 1250.50, change: "-2.4%", isProfit: false, icon: FileText, color: "#f43f5e" },
      { id: 3, name: "Cold Storage Ledger", price: 8999.00, change: "+5.1%", isProfit: true, icon: Cpu, color: "#eab308" }
    ],
    pending: [
      { id: 4, name: "Intraday Signal Access", price: 2999.00, change: "0.0%", isProfit: true, icon: RadioReceiver, color: "#a855f7" },
      { id: 6, name: "Quantum Arbitrage License", price: 15400.00, change: "0.0%", isProfit: true, icon: Activity, color: "#f43f5e" }
    ],
    sold: [
      { id: 5, name: "Wealth Management Session", price: 5000.00, change: "+24.8%", isProfit: true, icon: UserCheck, color: "#10b981" }
    ]
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'pending') {
      setIsInitialLoading(true);
      setTimeout(() => setIsInitialLoading(false), 1000);
    } else {
      setIsInitialLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleAuth = () => {
    setIsLoggedIn(!isLoggedIn);
    showToast(isLoggedIn ? "Terminal Disconnected" : "Terminal Authorized");
   
  };

  return (
    <div className="v-terminal">
     <Navigation/>

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
                    <span className="v-val">1,24,500.80</span>
                  </div>
                  <div className="v-btn-row">
                    <button className="v-btn-primary" onClick={()=>navigate("/recharge")}>DEPOSIT</button>
                    <button className="v-btn-dark">WITHDRAW</button>
                  </div>
               </div>
            </div>

            <div className="v-unit">
                <User size={16} className="v-mute" />
              <div className="v-unit-head">
                 <span className="v-unit-label">USER IDENTITY PROFILE</span>
                 <span className="v-unit-label">User Id</span>
                 
              </div>
              <div className="v-id-grid">
                 <div className="v-id-item">
                    <span className="v-id-label">USER NAME ID</span>
                    <div className="v-flex-between">
                      <span className="v-id-val">{isLoggedIn ? "John Doe" : "NOT AUTHENTICATED"}</span>
                      <Fingerprint size={14} className="v-text-mute" />
                    </div>
                 </div>
                 <div className="v-id-item">
                    <span className="v-id-label">EMAIL ADDRESS</span>
                    <div className="v-flex-between">
                      <span className="v-id-val">{isLoggedIn ? "john.doe@vertex.io" : "---"}</span>
                      <Mail size={14} className="v-text-mute" />
                    </div>
                 </div>
                 <div className="v-id-item">
                    <span className="v-id-label">MOBILE NUMBER</span>
                    <div className="v-flex-between">
                      <span className="v-id-val">{isLoggedIn ? "+91 98765 43210" : "---"}</span>
                      <Smartphone size={14} className="v-text-mute" />
                    </div>
                 </div>
                 <div className="v-id-item v-clickable-id" onClick={() => isLoggedIn}>
                    <span className="v-id-label">Account</span>
                    <div className="v-flex-between">
                      <span className=" v-cyan">My Portfolio</span>
                      <CreditCard size={14} className="v-cyan" />
                    </div>
                 </div>
              </div>
            </div>

            <div className="v-unit v-assets-unit">
              <div className="v-tabs">
                {['active', 'pending', 'sold'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={`v-tab ${activeTab === tab ? 'v-active' : ''}`}
                  >
                    {tab.toUpperCase()}
                    {activeTab === tab && <div className="v-glow-bar" />}
                  </button>
                ))}
              </div>

              <div className="v-assets-body">
                {isLoggedIn ? (
                  <AssetPerformanceList 
                    assets={products[activeTab]} 
                    type={activeTab} 
                    isInitialLoading={isInitialLoading}
                    onSell={(n) => showToast(`Executed: ${n}`)}
                  />
                ) : (
                  <div className="v-lock">
                    <p>ACCESS RESTRICTED. INITIALIZE LOGIN.</p>
                    <button className="v-btn-primary" style={{ width: 'auto', padding: '12px 40px', marginTop: '1rem' }} onClick={handleAuth}>LOGIN</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        
      </main>

      <div className={`v-toast ${toast.show ? 'v-visible' : ''}`}>
        <CheckCircle2 size={18} />
        <span>{toast.message}</span>
      </div>
<Footer/>
   
    </div>
  );
};

export default Account;