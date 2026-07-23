'use client';

import { useEffect, useState } from 'react';

const API = 'http://localhost:5000';

type DashboardData = {
  totals: { revenue: number; orders: number; customers: number; products: number };
  recentOrders: Array<{ id: number; invoice: string; total: number; createdAt: string; cashier: string; status: string }>;
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch(`${API}/api/dashboard`)
      .then(r => r.json())
      .then(setData);
  }, []);

  if (!data) return <p>Memuat data...</p>;

  const fmt = (n: number) => new Intl.NumberFormat('id-ID').format(n);

  return (
    <>
      <div className="page-title">
        <div>
          <p>Selamat datang kembali</p>
          <h1>Dashboard</h1>
          <small>Pantau performa bisnis Anda hari ini</small>
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
            <p>Pendapatan Hari Ini</p>
            <h2>Rp {fmt(data.totals.revenue)}</h2>
            <small>
              <b>↑ 12.5%</b> dari kemarin
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <div>
            <p>Total Transaksi</p>
            <h2>{data.totals.orders}</h2>
            <small>Transaksi hari ini</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <div>
            <p>Total Pelanggan</p>
            <h2>{data.totals.customers}</h2>
            <small>Pelanggan terdaftar</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div>
            <p>Total Produk</p>
            <h2>{data.totals.products}</h2>
            <small>Item dalam inventori</small>
          </div>
        </div>
      </div>

      <div className="workspace-grid">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Grafik Penjualan</h2>
              <p>Pendapatan 7 hari terakhir</p>
            </div>
            <button className="period-button">7 Hari</button>
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
              {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, i) => (
                <div className="bar-col" key={day}>
                  <i style={{ height: `${30 + Math.random() * 70}%` }} />
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Transaksi Terbaru</h2>
              <p>5 transaksi terakhir</p>
            </div>
          </div>
          <div className="order-list">
            {data.recentOrders.map((order, idx) => (
              <div className="order-row" key={order.id}>
                <div className={`order-icon color-${idx % 3}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                  </svg>
                </div>
                <div>
                  <b>{order.invoice}</b>
                  <small>{new Date(order.createdAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</small>
                </div>
                <strong>Rp {fmt(order.total)}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
