import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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



export default function App() {
  
  return (
    <Router>
      <Routes>
        {/* This sets ProductScreen to the root URL (/) */}
        <Route path="/Market" element={<ProductScreen />} />
        <Route path="/" element={<Home />} />
        <Route path="/Withdraw" element={<Withdraw />} />
        <Route path="/withdrawHistory" element={<WithdrawalHistory />} />
          <Route path="/RechargeHistory" element={<RechargeHistory/>} />
       
        <Route path="/account" element={<Account />} />
        <Route path="/auth" element={<Login_register_forget />} />
              <Route path="/recharge" element={<Recharge />} />
                      <Route path="/pay" element={<Pay />} />
        
        {/* You can add more routes here later, e.g. */}
        {/* <Route path="/cart" element={<CartScreen />} /> */}
      </Routes>
    </Router>
  );
}