'use client';

import { useState, FormEvent } from 'react';
import type { User } from '../page';

const API = 'http://localhost:5000';

export default function LoginPage({ onLogin }: { onLogin: (u: User) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Login gagal.'); return; }
      onLogin(data.user);
    } catch {
      setError('Tidak dapat terhubung ke server.');
    } finally {
      setLoading(false);
    }
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
            <p>Gunakan kredensial yang diberikan admin untuk melanjutkan.</p>
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
            <button type="submit" className="primary-button login-button" disabled={loading}>
              {loading ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity=".25"/><path d="M21 12a9 9 0 00-9-9"/></svg>
                  Memproses...
                </>
              ) : (
                <>
                  Masuk
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </>
              )}
            </button>
          </form>

          <div className="demo-account">
            <span>AKUN DEMO</span>
            <p><b>Admin:</b> admin / admin123 <i /> <b>Kasir:</b> kasir / kasir123</p>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
