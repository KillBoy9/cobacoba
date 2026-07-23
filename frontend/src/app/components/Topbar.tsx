'use client';

import { useState } from 'react';
import type { User } from '../page';

export default function Topbar({
  user,
  onLogout,
  onMenuToggle,
}: {
  user: User;
  onLogout: () => void;
  onMenuToggle: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="topbar">
      <button className="menu-button" onClick={onMenuToggle} aria-label="Toggle menu">
        <span />
        <span />
        <span />
      </button>

      <div className="top-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input type="text" placeholder="Cari produk, transaksi, laporan..." />
      </div>

      <div className="top-actions">
        <button className="icon-button" aria-label="Notifikasi">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <i />
        </button>
        <button className="icon-button" aria-label="Pesan">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
          </svg>
          <i />
        </button>
        <div style={{ position: 'relative' }}>
          <button
            className="user-mini top-avatar avatar"
            onClick={() => setShowMenu(v => !v)}
            style={{ cursor: 'pointer', fontSize: '13px', border: 0 }}
            aria-label="Menu user"
          >
            {user.name.charAt(0).toUpperCase()}
          </button>
          {showMenu && (
            <>
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 9,
                }}
                onClick={() => setShowMenu(false)}
              />
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  zIndex: 10,
                  minWidth: 180,
                  background: 'white',
                  border: '1px solid #ededf2',
                  borderRadius: 10,
                  padding: 8,
                  boxShadow: '0 4px 12px rgba(25,21,39,.08)',
                }}
              >
                <div style={{ padding: '10px 12px', borderBottom: '1px solid #f1f0f4' }}>
                  <b style={{ fontSize: 12, display: 'block' }}>{user.name}</b>
                  <small style={{ fontSize: 10, color: '#9695a6', display: 'block', marginTop: 3, textTransform: 'capitalize' }}>
                    {user.role}
                  </small>
                </div>
                <button
                  onClick={onLogout}
                  style={{
                    width: '100%',
                    border: 0,
                    background: 'transparent',
                    textAlign: 'left',
                    padding: '10px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#d87985',
                    borderRadius: 6,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = '#fff0f2')}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
