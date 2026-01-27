 import React from 'react';
 import "../styles/footer.css"
 import { 
  Zap, Github, Twitter, Linkedin
} from 'lucide-react';
 export const Footer = () => (
  <footer className="site-footer">
  
    <div className="footer-inner">
      <div className="footer-brand">
        <div className="logo-section" style={{ marginBottom: '20px' }}>
          <div className="logo-icon">
            <Zap size={18} color="white" fill="currentColor" />
          </div>
          <span className="logo-text" style={{ fontSize: '18px' }}>Vertex</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', maxWidth: '320px' }}>
          India's leading institutional gateway for equity derivatives and high-frequency order routing. Built for professional liquidity.
        </p>
        <div className="social-row">
          <a href="#" className="social-btn"><Twitter size={20} /></a>
          <a href="#" className="social-btn"><Linkedin size={20} /></a>
          <a href="#" className="social-btn"><Github size={20} /></a>
        </div>
      </div>

      <div>
        <h4 className="footer-heading">Ecosystem</h4>
        <ul className="footer-links">
          <li><a href="#" className="footer-link">Market Hub</a></li>
          <li><a href="#" className="footer-link">Portfolio Tracking</a></li>
          <li><a href="#" className="footer-link">Direct Clearing</a></li>
          <li><a href="#" className="footer-link">Liquidity Nodes</a></li>
        </ul>
      </div>

      <div>
        <h4 className="footer-heading">Legal</h4>
        <ul className="footer-links">
          <li><a href="#" className="footer-link">Risk Disclosure</a></li>
          <li><a href="#" className="footer-link">Privacy Policy</a></li>
          <li><a href="#" className="footer-link">Terms of Service</a></li>
          <li><a href="#" className="footer-link">Audit Protocol</a></li>
        </ul>
      </div>
    </div>

    <div className="footer-bottom">
      <div className="footer-bottom-inner">
        <p style={{ fontSize: '10px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '2px' }}>
          © 2026 Vertex Digital Securities Infrastructure • NSE/BSE Registered
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span className="label-xs" style={{ marginBottom: 0 }}>AES-256 Encrypted</span>
          <span className="label-xs" style={{ marginBottom: 0 }}>ISO 27001 Certified</span>
        </div>
      </div>
    </div>
  </footer>
);