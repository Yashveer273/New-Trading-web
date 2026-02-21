import React, { useState } from 'react';
import { 
   Activity, Globe, CheckCircle2, 
  ChevronRight, ArrowRight, 
  TrendingUp, Smartphone,  Menu, X,
  Shield, HelpCircle, 
} from 'lucide-react';
import { Footer } from './components/footer';
import './styles/home.css';
import HomepageCard from './components/homepageCard';
import { Link } from 'react-router-dom';
import Navigation from './components/Navigation';
// --- STYLING ---


const Home = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="v-body">
  
      <div className="v-hero-gradient" />
      
      {/* Navigation */}
    <Navigation/>

      <section className="v-hero">
  <div className="v-hero-inner">
    
    <div className="v-hero-badge">
      <Activity size={14} color="#3b82f6" />
      <span>Global Launch V2.0</span>
    </div>

    <h1 className="v-hero-title">
      Trade Faster.<br />Profit Smarter.
    </h1>

    <p className="v-hero-desc">
      The world's most intuitive trading platform. Whether you're buying your
      first Bitcoin or managing a professional portfolio, Adani CluxTrade gives you the edge.
    </p>

    <div className="v-hero-actions">
      <button className="v-hero-btn">
        Start Trading <ArrowRight size={18} />
      </button>

      <div className="v-hero-trust">
        <span>Trusted by thousands of Users</span>
        <div className="v-hero-avatars">
          {["https://images.pexels.com/photos/18718906/pexels-photo-18718906.jpeg?cs=srgb&dl=pexels-best-photography-748452391-18718906.jpg&fm=jpg",
           "https://images.pexels.com/photos/7276144/pexels-photo-7276144.jpeg?cs=srgb&dl=pexels-143deepak-7276144.jpg&fm=jpg",
            "https://cdn.pixabay.com/photo/2020/04/13/17/58/person-5039573_640.jpg", "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?cs=srgb&dl=pexels-olly-733872.jpg&fm=jpg"]
            .map( (src, i)=> (
            <img  key={i} src={src} alt="User" className="v-hero-avatar" />
          ))}
        </div>
      </div>
    </div>

  </div>
</section>



      {/* Market Stats */}
      <section style={{ padding: '48px 0', position: 'relative', zIndex: 10 }}>
        <div className="v-container">
          <div className="v-grid v-grid-stats">
            {[
              { label: 'BTC/USD', value: '$64,231.50', trend: '+2.4%', up: true },
              { label: 'ETH/USD', value: '$3,412.12', trend: '+1.8%', up: true },
              { label: 'S&P 500', value: '5,137.08', trend: '-0.4%', up: false },
              { label: 'GOLD', value: '$2,154.30', trend: '+0.2%', up: true }
            ].map((stat, i) => (
              <div key={i} className="v-stat-box">
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', fontFamily: 'monospace' }}>{stat.value}</span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', color: stat.up ? '#10b981' : '#f43f5e' }}>
                    {stat.trend} {stat.up ? <TrendingUp size={14} /> : <Activity size={14} />}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 0' }}>
        <div className="v-container">
          <div className="v-grid v-grid-features">
            {[
              { icon: <TrendingUp color="#3b82f6" />, title: 'Smart Analytics', desc: 'Visualize market trends with advanced charting tools and real-time indicators designed for clarity.' },
              { icon: <Shield color="#10b981" />, title: 'Secure Assets', desc: 'Rest easy knowing your funds are protected by multi-layer encryption and institutional-grade custody.' },
              { icon: <Smartphone color="#a855f7" />, title: 'Professional Trading, Anywhere', desc: 'Our advanced web trading platform delivers a powerful desktop experience with smooth performance on mobile browsers trade without limits.' }
            ].map((feature, i) => (
              <div key={i} className="v-card-glass">
                <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: 'white', textTransform: 'uppercase', fontStyle: 'italic' }}>{feature.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Connection */}
      <section style={{ padding: '60px 0' }}>
        <div className="v-container">
          <div className="v-globe-section">
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 900, fontStyle: 'italic', marginBottom: '24px', textTransform: 'uppercase', lineHeight: 1.2 }}>Global Access, <br/> Local Experience.</h2>
              <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '32px' }}>
                We connect you to major exchanges across the globe. Experience zero-delay pricing and instant execution regardless of your location.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {['Trade in 40+ Global Markets', 'Support for 15+ Major Currencies', '24/7 Multi-lingual Support'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white', fontWeight: 500 }}>
                    <CheckCircle2 size={20} color="#3b82f6" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <Globe size={320} className="v-globe-responsive" />
            </div>
          </div>
        </div>
      </section>
<HomepageCard/>
      {/* FAQ */}
      <section style={{ padding: '30px 0' }}>
        <div className="v-container" style={{ maxWidth: '768px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <HelpCircle style={{ color: '#3b82f6', marginBottom: '16px' }} size={40} />
            <h2 style={{ fontSize: '30px', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase' }}>Common Questions</h2>
          </div>
          {[{ q: "How do I start trading on Adani CluxTrade?", a: "Getting started is simple. Create an account, verify your identity, deposit funds using your preferred method, and you can start trading in minutes." },
            { q: "What types of assets can I trade?", a: "Adani CluxTrade offers a diverse range of assets including Stocks, Commodities, Currencies, and Indices from all major global exchanges." },
            { q: "Is my personal data and money safe?", a: "Absolutely. We use end-to-end encryption, two-factor authentication (2FA), and keep the majority of assets in secure offline storage." }
          ].map((item, idx) => (
            <div key={idx} className="v-faq-item" onClick={() => toggleFaq(idx)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: activeFaq === idx ? '#3b82f6' : 'white', transition: 'color 0.3s' }}>{item.q}</span>
                <ChevronRight size={20} style={{ color: '#64748b', transition: 'transform 0.3s', transform: activeFaq === idx ? 'rotate(90deg)' : 'none' }} />
              </div>
              <div style={{ maxHeight: activeFaq === idx ? '200px' : '0', overflow: 'hidden', opacity: activeFaq === idx ? 1 : 0, transition: 'all 0.3s ease' }}>
                <p style={{ marginTop: '16px', color: '#94a3b8', lineHeight: 1.6 }}>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Home;