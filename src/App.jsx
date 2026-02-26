import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';

import ProductScreen from './ProductScreen';
import Home from './home';
import Account from './account';
import Login_register_forget from './Login_register_forget';
import Recharge from './components/Recharge';
import Pay from './components/pay';
import Withdraw from './Withdraw';
import WithdrawalHistory from './withdrawHistory';
import RechargeHistory from './RechargeHistory';
import { getUserData } from './api';

export default function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ NEW

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getUserData();
        console.log(userData);
        setUser(userData);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); // ✅ stop loading AFTER response
      }
    };
    loadUser();
  }, []);

  // ✅ Wait until user check finishes
  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>

        {/* NOT logged in */}
      

        {/* Logged in */}
        {user._id && (
          <>
            <Route path="/Market" element={<ProductScreen />} />
            <Route path="/" element={<Home />} />
            <Route path="/Withdraw" element={<Withdraw />} />
            <Route path="/withdrawHistory" element={<WithdrawalHistory />} />
            <Route path="/RechargeHistory" element={<RechargeHistory />} />
            <Route path="/account" element={<Account />} />
            <Route path="/auth" element={<Login_register_forget />} />
            <Route path="/recharge" element={<Recharge />} />
            <Route path="/pay" element={<Pay />} />
          </>
        )}
  {!user._id && (
          <>
            <Route path="/auth" element={<Login_register_forget />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}