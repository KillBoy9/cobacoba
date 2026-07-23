'use client';

type Page = 'dashboard' | 'kasir' | 'produk' | 'laporan' | 'pengaturan';

export default function Sidebar({
  active,
  onChange,
  role,
  menuOpen,
  onCloseMenu,
}: {
  active: Page;
  onChange: (p: Page) => void;
  role: string;
  menuOpen: boolean;
  onCloseMenu: () => void;
}) {
  function nav(p: Page) {
    onChange(p);
    onCloseMenu();
  }

  return (
    <aside className="sidebar" style={menuOpen ? { left: 0 } : undefined}>
      <div className="sidebar-brand">
        <span className="brand-mark">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </span>
        Kasirku
      </div>

      <nav>
        <button className={`nav-item ${active === 'dashboard' ? 'active' : ''}`} onClick={() => nav('dashboard')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          Dashboard
        </button>
        <button className={`nav-item ${active === 'kasir' ? 'active' : ''}`} onClick={() => nav('kasir')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          Kasir (POS)
        </button>
        <button className={`nav-item ${active === 'produk' ? 'active' : ''}`} onClick={() => nav('produk')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          Produk
        </button>
        <button className={`nav-item ${active === 'laporan' ? 'active' : ''}`} onClick={() => nav('laporan')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
          Laporan
        </button>
        {role === 'admin' && (
          <button className={`nav-item ${active === 'pengaturan' ? 'active' : ''}`} onClick={() => nav('pengaturan')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m5.2-16.2l-1.4 1.4M13 12l-1.4 1.4m0 0l-1.4 1.4M1 12h6m6 0h6m-16.2 5.2l1.4-1.4M12 13l1.4 1.4m0 0l1.4 1.4"/></svg>
            Pengaturan
          </button>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="help-card">
          <span>BUTUH BANTUAN?</span>
          <p>Hubungi tim support untuk panduan penggunaan.</p>
          <button className="text-button">
            Hubungi Support
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
