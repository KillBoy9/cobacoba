'use client';

import { useEffect, useState } from 'react';

const API = 'http://localhost:5000';

type ReportData = {
  summary: { revenue: number; orders: number; average: number };
  daily: Array<{ date: string; revenue: number; orders: number }>;
  products: Array<{ name: string; quantity: number; revenue: number }>;
};

export default function Laporan() {
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    fetch(`${API}/api/reports`)
      .then(r => r.json())
      .then(setData);
  }, []);

  if (!data) return <p>Memuat laporan...</p>;

  const fmt = (n: number) => new Intl.NumberFormat('id-ID').format(n);

  return (
    <>
      <div className="page-title">
        <div>
          <p>Analisis Bisnis</p>
          <h1>Laporan Penjualan</h1>
          <small>Pantau performa penjualan 7 hari terakhir</small>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon purple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          </div>
          <div>
            <p>Total Pendapatan</p>
            <h2>Rp {fmt(data.summary.revenue)}</h2>
            <small>7 hari terakhir</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
            </svg>
          </div>
          <div>
            <p>Total Transaksi</p>
            <h2>{data.summary.orders}</h2>
            <small>7 hari terakhir</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div>
            <p>Rata-rata Transaksi</p>
            <h2>Rp {fmt(Math.round(data.summary.average))}</h2>
            <small>Per transaksi</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <div>
            <p>Produk Terjual</p>
            <h2>{data.products.reduce((sum, p) => sum + p.quantity, 0)}</h2>
            <small>Total unit</small>
          </div>
        </div>
      </div>

      <div className="workspace-grid report-grid">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Pendapatan Harian</h2>
              <p>Grafik pendapatan per hari</p>
            </div>
          </div>
          <div className="chart-wrap">
            <div className="y-axis">
              <span>100rb</span>
              <span>75rb</span>
              <span>50rb</span>
              <span>25rb</span>
              <span>0</span>
            </div>
            <div className="bar-chart">
              {data.daily.map(day => {
                const maxRev = Math.max(...data.daily.map(d => d.revenue), 1);
                const height = (day.revenue / maxRev) * 100;
                return (
                  <div className="bar-col" key={day.date}>
                    <i style={{ height: `${height}%` }} title={`Rp ${fmt(day.revenue)}`} />
                    {new Date(day.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Produk Terlaris</h2>
              <p>5 produk dengan penjualan tertinggi</p>
            </div>
          </div>
          <div className="data-list" style={{ marginTop: 22 }}>
            {data.products.length === 0 ? (
              <p className="empty-state">Belum ada data penjualan produk.</p>
            ) : (
              data.products.map((product, idx) => (
                <div className="data-row" key={idx}>
                  <div>
                    <b>{product.name}</b>
                    <small>{product.quantity} unit terjual</small>
                  </div>
                  <strong>Rp {fmt(product.revenue)}</strong>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
