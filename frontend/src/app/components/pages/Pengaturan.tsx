'use client';

import { useEffect, useState, FormEvent } from 'react';

const API = 'http://localhost:5000';

type Settings = { storeName: string; address: string; phone: string; tax: string; currency: string };

export default function Pengaturan() {
  const [settings, setSettings] = useState<Settings>({ storeName: '', address: '', phone: '', tax: '', currency: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetch(`${API}/api/settings`)
      .then(r => r.json())
      .then(setSettings);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        setToast('Gagal menyimpan pengaturan.');
        setTimeout(() => setToast(''), 3000);
        return;
      }
      setToast('Pengaturan berhasil disimpan!');
      setTimeout(() => setToast(''), 3000);
    } catch {
      setToast('Tidak dapat terhubung ke server.');
      setTimeout(() => setToast(''), 3000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="page-title">
        <div>
          <p>Konfigurasi Sistem</p>
          <h1>Pengaturan</h1>
          <small>Kelola informasi toko dan konfigurasi</small>
        </div>
      </div>

      {toast && (
        <div className="toast-message">
          {toast}
          <button onClick={() => setToast('')}>×</button>
        </div>
      )}

      <div className="panel" style={{ maxWidth: 900 }}>
        <h2>Informasi Toko</h2>
        <form className="settings-form" onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <div className="settings-fields">
            <label>
              Nama Toko
              <input type="text" placeholder="Kasirku Demo" value={settings.storeName} onChange={e => setSettings({ ...settings, storeName: e.target.value })} required />
            </label>
            <label>
              No. Telepon
              <input type="text" placeholder="0812-3456-7890" value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })} required />
            </label>
            <label className="wide">
              Alamat
              <input type="text" placeholder="Jl. Merdeka No. 12, Jakarta" value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })} required />
            </label>
            <label>
              Pajak (%)
              <input type="number" placeholder="0" value={settings.tax} onChange={e => setSettings({ ...settings, tax: e.target.value })} min="0" max="100" step="0.1" />
            </label>
            <label>
              Mata Uang
              <select value={settings.currency} onChange={e => setSettings({ ...settings, currency: e.target.value })}>
                <option value="IDR">IDR - Rupiah</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </label>
          </div>
          <div className="form-actions" style={{ marginTop: 20 }}>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </button>
          </div>
        </form>
      </div>

      <div className="panel" style={{ maxWidth: 900, marginTop: 18 }}>
        <h2>Informasi Sistem</h2>
        <div style={{ marginTop: 16, color: '#777587', fontSize: 12, lineHeight: 1.8 }}>
          <p>
            <b style={{ color: '#444354', fontWeight: 600 }}>Versi:</b> 1.0.0
          </p>
          <p>
            <b style={{ color: '#444354', fontWeight: 600 }}>Database:</b> SQLite
          </p>
          <p>
            <b style={{ color: '#444354', fontWeight: 600 }}>Server:</b> http://localhost:5000
          </p>
        </div>
      </div>
    </>
  );
}
