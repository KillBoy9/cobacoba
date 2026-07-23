'use client';

import { useState } from 'react';
import type { User } from '../page';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Dashboard from './pages/Dashboard';
import Kasir from './pages/Kasir';
import Produk from './pages/Produk';
import Laporan from './pages/Laporan';
import Pengaturan from './pages/Pengaturan';

type Page = 'dashboard' | 'kasir' | 'produk' | 'laporan' | 'pengaturan';

export default function AppShell({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [page, setPage] = useState<Page>('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar active={page} onChange={setPage} role={user.role} menuOpen={menuOpen} onCloseMenu={() => setMenuOpen(false)} />
      <div className="main-area">
        <Topbar user={user} onLogout={onLogout} onMenuToggle={() => setMenuOpen(v => !v)} />
        <div className="content">
          {page === 'dashboard' && <Dashboard />}
          {page === 'kasir' && <Kasir cashier={user.name} />}
          {page === 'produk' && <Produk />}
          {page === 'laporan' && <Laporan />}
          {page === 'pengaturan' && <Pengaturan />}
        </div>
      </div>
    </div>
  );
}
