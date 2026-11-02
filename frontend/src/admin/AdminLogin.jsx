import React, { useState, useEffect } from 'react';
import { Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Compass, TrendingUp, ShieldCheck, Building2 } from 'lucide-react';
import { authService } from './auth';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  // If already logged in, redirect
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const user = authService.getUser();
      if (user) {
        if (onLoginSuccess) {
          onLoginSuccess(user);
        } else {
          window.location.href = '/admin/dashboard';
        }
      }
    }
  }, [onLoginSuccess]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');
    setForgotMsg('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login(email.trim(), password.trim(), rememberMe);
      setSuccessMsg(`Welcome back, ${res.user.name} (${res.user.role})! Redirecting...`);
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(res.user);
        } else {
          window.location.href = '/admin/dashboard';
        }
      }, 700);
    } catch (err) {
      setError(err.message || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };



  const handleForgotPass = () => {
    setForgotMsg('Use demo credentials below or contact your IT administrator to reset credentials.');
  };

  return (
    <div className="login-root-container">
      {/* Dynamic styling for responsive full screen design */}
      <style>{`
        .login-root-container {
          min-height: 100vh;
          height: 100vh;
          width: 100vw;
          margin: 0;
          padding: 0;
          overflow: hidden;
          display: flex;
          background-color: #ffffff;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .login-card {
          width: 100%;
          height: 100vh;
          max-width: 100%;
          background: #ffffff;
          border-radius: 0;
          box-shadow: none;
          border: none;
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          overflow: hidden;
        }

        .login-input {
          width: 100%;
          box-sizing: border-box;
          padding: 13px 14px 13px 42px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          color: #0f172a;
          outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }

        .login-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
        }

        .login-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 20px;
          border-radius: 10px;
          background: #2563eb;
          border: none;
          color: #ffffff;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.28);
        }

        .login-btn:hover:not(:disabled) {
          background: #1d4ed8;
          box-shadow: 0 6px 18px rgba(37, 99, 235, 0.38);
        }

        .login-btn:active:not(:disabled) {
          transform: translateY(1px);
        }

        .feature-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 12px;
          box-shadow: 0 2px 4px rgba(15, 23, 42, 0.02);
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        .feature-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.04);
        }

        .demo-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #334155;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .demo-pill-btn:hover {
          background: #eff6ff;
          border-color: #93c5fd;
          color: #1d4ed8;
        }

        @media (max-width: 900px) {
          .login-card {
            grid-template-columns: 1fr;
          }
          .login-left-panel {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Full-Screen 2-Column Layout */}
      <div className="login-card">
        {/* Left Side: Brand & Feature Highlights */}
        <div
          className="login-left-panel"
          style={{
            background: '#f8fafc',
            borderRight: '1px solid #e2e8f0',
            padding: '48px 56px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            height: '100vh',
            overflowY: 'auto'
          }}
        >
          {/* Top Branding */}
          <div>
            {/* Logo & Emblem */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 14px rgba(37, 99, 235, 0.28)'
                }}
              >
                <Building2 size={24} color="#ffffff" />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    letterSpacing: '-0.3px',
                    color: '#0f172a',
                    margin: 0,
                    lineHeight: 1.1
                  }}
                >
                  ESTATESPHERE
                </h1>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb' }}>
                  by EstateSphere
                </span>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 16px 0', lineHeight: 1.4 }}>
              Luxury Real Estate & Property Management System
            </p>

            {/* Accent Line */}
            <div
              style={{
                width: '36px',
                height: '3.5px',
                background: '#2563eb',
                borderRadius: '3px',
                marginBottom: '28px'
              }}
            />

            {/* 3 Modern Feature Cards */}
            <div className="feature-card">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#eff6ff',
                  border: '1px solid #dbeafe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb',
                  flexShrink: 0
                }}
              >
                <Compass size={20} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                  Real-Time Tracking
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Monitor luxury listings, inquiries and deals with live sync
                </div>
              </div>
            </div>

            <div className="feature-card">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#eff6ff',
                  border: '1px solid #dbeafe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb',
                  flexShrink: 0
                }}
              >
                <TrendingUp size={20} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                  Smart Analytics
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Data-driven market metrics for better property decisions
                </div>
              </div>
            </div>

            <div className="feature-card">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#eff6ff',
                  border: '1px solid #dbeafe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb',
                  flexShrink: 0
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                  Secure & Reliable
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Enterprise-grade role protection and session security
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats Card */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '14px 16px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(15, 23, 42, 0.02)',
              marginTop: '24px'
            }}
          >
            <div style={{ borderRight: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>500+</div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px', marginTop: '2px' }}>
                ACTIVE UNITS
              </div>
            </div>
            <div style={{ borderRight: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>10K+</div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px', marginTop: '2px' }}>
                CLIENTS MANAGED
              </div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>99.9%</div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px', marginTop: '2px' }}>
                UPTIME
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div
          style={{
            background: '#ffffff',
            padding: '48px 56px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}
        >
          <div style={{ width: '100%', maxWidth: '440px' }}>
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h2
              style={{
                fontSize: '26px',
                fontWeight: 800,
                color: '#0f172a',
                margin: 0,
                letterSpacing: '-0.3px'
              }}
            >
              Welcome Back
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '6px 0 0 0' }}>
              Sign in to your dashboard
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: '10px',
                background: '#fef2f2',
                border: '1.5px solid #fca5a5',
                color: '#b91c1c',
                fontSize: '13px',
                lineHeight: 1.45,
                marginBottom: '18px'
              }}
            >
              <AlertCircle size={17} style={{ flexShrink: 0, marginTop: '2px', color: '#dc2626' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '13.5px', marginBottom: '2px' }}>
                  {error.toLowerCase().includes('password') 
                    ? '⚠️ Password Galat Hai' 
                    : (error.toLowerCase().includes('email') ? '⚠️ Email Galat Hai' : '⚠️ Authentication Error')}
                </strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '11px 14px',
                borderRadius: '10px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#15803d',
                fontSize: '13px',
                marginBottom: '18px'
              }}
            >
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Forgot Message Info */}
          {forgotMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '11px 14px',
                borderRadius: '10px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#1e40af',
                fontSize: '12px',
                marginBottom: '18px'
              }}
            >
              <span>{forgotMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.6px',
                    color: error && error.toLowerCase().includes('email') ? '#dc2626' : '#475569',
                    textTransform: 'uppercase'
                  }}
                >
                  EMAIL ADDRESS
                </label>
                {error && error.toLowerCase().includes('email') && (
                  <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>
                    Email registered nahi hai
                  </span>
                )}
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail
                  size={17}
                  color={error && error.toLowerCase().includes('email') ? '#ef4444' : '#94a3b8'}
                  style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="Enter your email"
                  className="login-input"
                  style={error && error.toLowerCase().includes('email') ? { borderColor: '#ef4444', background: '#fef2f2' } : {}}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.6px',
                    color: error && error.toLowerCase().includes('password') ? '#dc2626' : '#475569',
                    textTransform: 'uppercase'
                  }}
                >
                  PASSWORD
                </label>
                {error && error.toLowerCase().includes('password') && (
                  <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>
                    Password galat hai
                  </span>
                )}
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock
                  size={17}
                  color={error && error.toLowerCase().includes('password') ? '#ef4444' : '#94a3b8'}
                  style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  className="login-input"
                  style={{
                    paddingRight: '42px',
                    ...(error && error.toLowerCase().includes('password') ? { borderColor: '#ef4444', background: '#fef2f2' } : {})
                  }}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    padding: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#2563eb', width: '15px', height: '15px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '13px', color: '#475569' }}>Remember me</span>
              </label>

              <button
                type="button"
                onClick={handleForgotPass}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="login-btn"
              style={{
                opacity: loading ? 0.75 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '6px'
              }}
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Back to Public Website & Copyright */}
          <div style={{ textAlign: 'center', marginTop: '28px' }}>
            <a
              href="/"
              style={{
                color: '#64748b',
                fontSize: '12px',
                textDecoration: 'none',
                display: 'inline-block',
                marginBottom: '10px'
              }}
            >
              ← Back to EstateSphere Website
            </a>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              © 2026 EstateSphere. All rights reserved.
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
