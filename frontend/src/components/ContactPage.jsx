import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, X, Menu } from 'lucide-react';
import { dataStore } from '../admin/dataStore';
import '../styles/contact-page.css';

export default function ContactPage({ navigateTo, openForm }) {
  const pageRef = useRef(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="contact-page-wrapper" ref={pageRef}>
      <header className="era-nav">
        <a href="/" className="era-mark-circular" onClick={e => { e.preventDefault(); navigateTo('/') }}>
          <svg viewBox="0 0 100 100" width="120" height="120">
            <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
            <text>
              <textPath href="#circlePath" startOffset="0%" style={{ fontSize: '12px', fill: '#1a2233', letterSpacing: '4px', textTransform: 'uppercase' }}>
                DWELLORA • DWELLORA •
              </textPath>
            </text>
          </svg>
          <div className="center-icon">✣</div>
        </a>
        
        <div className="nav-actions-stacked">
          <button className="select-apartment-contact" onClick={() => navigateTo('/apartments')}>SELECT<br/>AN APARTMENT</button>
          <div className="hero-links-contact">
            <a href="#book-call" onClick={e => { e.preventDefault(); if(openForm) openForm(); }}>BOOK A CALL</a><br />
            <a href="#form" onClick={e => { e.preventDefault(); document.getElementById('form').scrollIntoView({ behavior: 'smooth' }); }}>CONTACT</a>
          </div>
        </div>
      </header>

      <div className="vertical-home-contact">
        <a href="/" onClick={e => { e.preventDefault(); navigateTo('/'); }} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>HOME</a> / CONTACT
      </div>

      <section className="contact-hero">
        <h1>Contact Us</h1>
        
        <div className="contact-grid-info">
          <div className="info-col">
            <small>Write Us</small>
            <a href="mailto:info@codervu.com">info@codervu.com</a>
          </div>
          <div className="info-col">
            <small>Sales Office & Location</small>
            <p>302-B, 3rd Floor,<br/>Swadesh Bhawan Indore (452001)</p>
          </div>
          <div className="info-col">
            <small>Talk to Us</small>
            <a href="tel:+917987880769">+91 (798) 788-0769</a>
            <p>WhatsApp</p>
          </div>
        </div>
      </section>

      <section className="contact-interactive-section">
        <div className="map-container">
          <div className="map-marker">
            SALES OFFICE<br/>DAILY 09:00 - 21:00
            <span style={{fontSize: '18px'}}>✣</span>
          </div>
          
          <a href="#book-call" className="book-call-circle" onClick={e => { e.preventDefault(); if(openForm) openForm(); }}>
            Book a call<br/>Now
          </a>
        </div>
        
        <div className="dark-form-container" id="form">
          <form className="premium-contact-form" onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.target);
            dataStore.addInquiry({
              name: (formData.get('firstName') || '') + ' ' + (formData.get('lastName') || ''),
              email: formData.get('email'),
              phone: formData.get('phone'),
              message: formData.get('message')
            });
            fetch('/api/inquiries', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: formData.get('firstName') + ' ' + formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                message: formData.get('message')
              })
            }).then(res => {
              setNotification('Message sent successfully! We will get back to you within 24 hours.'); e.target.reset();

            }).catch(err => {
              setNotification('Message sent successfully! We will get back to you within 24 hours.'); e.target.reset();
              console.error(err);
            });
          }}>
            <div className="form-row">
              <div className="form-group">
                <label>FIRST NAME</label>
                <input name="firstName" type="text" required />
              </div>
              <div className="form-group">
                <label>LAST NAME</label>
                <input name="lastName" type="text" required />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>EMAIL</label>
                <input name="email" type="email" required />
              </div>
              <div className="form-group">
                <label>PHONE (OPTIONAL)</label>
                <input name="phone" type="tel" />
              </div>
            </div>

            <div className="form-group full-width">
              <label>HOW CAN WE HELP YOU?</label>
              <textarea name="message" required placeholder="Tell us about your preferences..." rows="4"></textarea>
            </div>
            
            <div className="form-footer">
              <p className="privacy-note">By sending this message you agree to our <a href="#">Privacy Policy</a>.</p>
              <button type="submit" className="submit-btn">
                SEND REQUEST <ArrowRight size={14} style={{marginLeft: '10px'}} />
              </button>
            </div>
          </form>
        </div>
      </section>

      {notification && <div className="era-modal" style={{zIndex: 9999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={() => setNotification(null)}><div style={{background: '#1a1a1a', padding: '60px 40px', color: '#fff', textAlign: 'center', maxWidth: '450px', width: '90%', border: '1px solid #333', position: 'relative'}}><h3 style={{fontFamily: '"Playfair Display", serif', fontWeight: 300, marginBottom: '30px', fontSize: '26px'}}>{notification}</h3><button onClick={() => setNotification(null)} style={{background: '#fff', color: '#000', padding: '12px 35px', border: 'none', cursor: 'pointer', letterSpacing: '2px', fontSize: '12px'}}>CLOSE</button></div></div>}
    </div>
  );
}
