'use client';

import { useState, FormEvent } from 'react';
import type { User } from '../page';

// Akun demo — tidak terhubung ke database/API
const DEMO_USERS: Record<string, User> = {
  admin: { id: 1, username: 'admin', role: 'admin', name: 'Admin POS' },
  kasir: { id: 2, username: 'kasir', role: 'kasir', name: 'Kasir POS' },
};
const DEMO_PASSWORDS: Record<string, string> = {
  admin: 'admin123',
  kasir: 'kasir123',
};

export default function LoginPage({ onLogin }: { onLogin: (u: User) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  function doLogin(user: string, pass: string) {
    setError('');
    const found = DEMO_USERS[user];
    if (found && DEMO_PASSWORDS[user] === pass) {
      onLogin(found);
    } else {
      setError('Username atau password tidak sesuai.');
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    doLogin(username, password);
  }

  function loginDemo(role: 'admin' | 'kasir') {
    doLogin(role, DEMO_PASSWORDS[role]);
  }

  return (
    <div className="login-page">
      {/* Left visual panel */}
      <div className="login-visual">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="grid-pattern" />
        <div className="login-brand">
          <span className="brand-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </span>
          Kasirku
        </div>
        <div className="login-copy">
          <span className="eyebrow light">POINT OF SALE SYSTEM</span>
          <h1>Kelola bisnis lebih mudah &amp; cepat</h1>
          <p>Pantau transaksi, stok produk, dan laporan penjualan dalam satu dashboard yang modern.</p>
        </div>
        <div className="visual-stat">
          <div className="visual-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
          <div>
            <strong>Transaksi hari ini meningkat 24%</strong>
            <small>Dibanding rata-rata minggu lalu</small>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-panel">
        <div className="login-form-wrap">
          <div className="mobile-brand">
            <span className="brand-mark" style={{ background: '#6659d8', color: 'white' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </span>
            Kasirku
          </div>

          <div className="form-heading">
            <span className="eyebrow">SELAMAT DATANG KEMBALI</span>
            <h2>Masuk ke akun Anda</h2>
            <p>Masukkan kredensial atau gunakan akun demo di bawah.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              Username
              <input
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </label>
            <label>
              Password
              <div className="password-field">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 12, top: 12, border: 0, background: 'transparent', cursor: 'pointer', padding: 0, color: '#9d9cac' }}
                  aria-label={showPw ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPw ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </label>
            {error && <p className="form-message">{error}</p>}
            <button type="submit" className="primary-button login-button">
              Masuk
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </form>

          <div className="demo-account">
            <span>MASUK CEPAT DEMO</span>
            <p style={{ marginBottom: 10 }}>Klik untuk langsung masuk tanpa mengisi form:</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => loginDemo('admin')}
                style={{
                  flex: 1,
                  border: '1px solid #c5c0f0',
                  borderRadius: 8,
                  background: '#efedff',
                  color: '#5a4ecc',
                  padding: '9px 12px',
                  fontWeight: 700,
                  fontSize: 11,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  transition: '.15s',
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#e2dfff')}
                onMouseOut={e => (e.currentTarget.style.background = '#efedff')}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Login sebagai Admin
              </button>
              <button
                type="button"
                onClick={() => loginDemo('kasir')}
                style={{
                  flex: 1,
                  border: '1px solid #c8e6c9',
                  borderRadius: 8,
                  background: '#f1f8f1',
                  color: '#2e7d32',
                  padding: '9px 12px',
                  fontWeight: 700,
                  fontSize: 11,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  transition: '.15s',
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#e4f4e5')}
                onMouseOut={e => (e.currentTarget.style.background = '#f1f8f1')}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Login sebagai Kasir
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
