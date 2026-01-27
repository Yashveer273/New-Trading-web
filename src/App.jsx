import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ProductScreen from './ProductScreen';
import Home from './home';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* This sets ProductScreen to the root URL (/) */}
        <Route path="/Market" element={<ProductScreen />} />
        <Route path="/" element={<Home />} />
        
        {/* You can add more routes here later, e.g. */}
        {/* <Route path="/cart" element={<CartScreen />} /> */}
      </Routes>
    </Router>
  );
}