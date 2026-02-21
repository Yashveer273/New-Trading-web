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

// import your getUserData
// import { getUserData } from './yourFile';

export default function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getUserData();
      setUser(userData);
    };
    loadUser();
  }, []);

  return (
    <Router>
      <Routes>

        {/* If NOT logged in → always go to auth */}
        {!user && (
          <>
            <Route path="/auth" element={<Login_register_forget />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </>
        )}

        {/* If logged in → allow everything */}
        {user && (
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

      </Routes>
    </Router>
  );
}