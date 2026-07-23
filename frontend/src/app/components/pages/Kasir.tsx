'use client';

import { useEffect, useState } from 'react';

const API = 'http://localhost:5000';

type Product = { id: number; name: string; price: number; stock: number; category: string };
type CartItem = Product & { quantity: number };

export default function Kasir({ cashier }: { cashier: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then(r => r.json())
      .then(setProducts);
  }, []);

  function addToCart(product: Product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        setToast(`Stok ${product.name} tidak mencukupi`);
        setTimeout(() => setToast(''), 3000);
        return;
      }
      setCart(cart.map(item => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }

  function updateQuantity(id: number, delta: number) {
    setCart(cart.map(item => {
      if (item.id !== id) return item;
      const newQty = item.quantity + delta;
      if (newQty < 1) return item;
      if (newQty > item.stock) {
        setToast(`Stok maksimal: ${item.stock}`);
        setTimeout(() => setToast(''), 3000);
        return item;
      }
      return { ...item, quantity: newQty };
    }));
  }

  function removeItem(id: number) {
    setCart(cart.filter(item => item.id !== id));
  }

  async function checkout() {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
          cashier,
          customer: customer.name ? customer : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast(data.message || 'Transaksi gagal.');
        setTimeout(() => setToast(''), 4000);
        return;
      }
      setToast(`Transaksi berhasil! Invoice: ${data.order.invoice}`);
      setTimeout(() => setToast(''), 5000);
      setCart([]);
      setCustomer({ name: '', phone: '' });
      // Refresh products
      const pRes = await fetch(`${API}/api/products`);
      setProducts(await pRes.json());
    } catch {
      setToast('Tidak dapat terhubung ke server.');
      setTimeout(() => setToast(''), 4000);
    } finally {
      setLoading(false);
    }
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const fmt = (n: number) => new Intl.NumberFormat('id-ID').format(n);

  const colors = ['product-0', 'product-1', 'product-2', 'product-3'];

  return (
    <>
      <div className="page-title">
        <div>
          <p>Point of Sale</p>
          <h1>Kasir</h1>
          <small>Proses transaksi penjualan dengan cepat</small>
        </div>
      </div>

      {toast && (
        <div className="toast-message">
          {toast}
          <button onClick={() => setToast('')}>×</button>
        </div>
      )}

      <div className="transaction-section">
        <div className="section-heading">
          <div>
            <h2>Pilih Produk</h2>
            <p>Klik produk untuk menambahkan ke keranjang</p>
          </div>
          <span>{products.length} produk tersedia</span>
        </div>

        <div className="pos-grid">
          <div className="product-grid">
            {products.map((product, idx) => (
              <div className="product-card" key={product.id}>
                <div className={`product-art ${colors[idx % colors.length]}`}>
                  <span>{product.name.charAt(0)}</span>
                </div>
                <div className="product-info">
                  <small>{product.category}</small>
                  <h3>{product.name}</h3>
                  <div>
                    <b>Rp {fmt(product.price)}</b>
                    <button onClick={() => addToCart(product)} disabled={product.stock < 1} aria-label={`Tambah ${product.name}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-panel">
            <div className="cart-heading">
              <div>
                <h2>Keranjang</h2>
                <span>{cart.length} item</span>
              </div>
              {cart.length > 0 && <button onClick={() => setCart([])}>Kosongkan</button>}
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                    </svg>
                  </span>
                  <b>Keranjang kosong</b>
                  <p>Pilih produk untuk memulai transaksi</p>
                </div>
              ) : (
                cart.map(item => (
                  <div className="cart-item" key={item.id}>
                    <div>
                      <b>{item.name}</b>
                      <small>
                        Rp {fmt(item.price)} × {item.quantity}
                      </small>
                    </div>
                    <strong>Rp {fmt(item.price * item.quantity)}</strong>
                    <div className="quantity">
                      <button onClick={() => updateQuantity(item.id, -1)} aria-label="Kurangi">
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} aria-label="Tambah">
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{ marginLeft: 4, color: '#d87985', borderColor: '#f7d6dc' }}
                        aria-label="Hapus"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <>
                <div style={{ padding: '14px 0', borderTop: '1px solid var(--line)' }}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#5d5b6c', marginBottom: 6 }}>
                    Pelanggan (opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Nama pelanggan"
                    value={customer.name}
                    onChange={e => setCustomer({ ...customer, name: e.target.value })}
                    style={{
                      width: '100%',
                      border: '1px solid #e2e1e9',
                      borderRadius: 7,
                      padding: '8px 10px',
                      fontSize: 11,
                      marginBottom: 6,
                      outline: 'none',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="No. telepon"
                    value={customer.phone}
                    onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                    style={{ width: '100%', border: '1px solid #e2e1e9', borderRadius: 7, padding: '8px 10px', fontSize: 11, outline: 'none' }}
                  />
                </div>

                <div className="cart-total">
                  <div>
                    <span>Subtotal</span>
                    <b>Rp {fmt(total)}</b>
                  </div>
                  <div>
                    <span>Pajak</span>
                    <b>Rp 0</b>
                  </div>
                  <div className="grand-total">
                    <span>Total Bayar</span>
                    <strong>Rp {fmt(total)}</strong>
                  </div>
                </div>

                <button className="primary-button pay-button" onClick={checkout} disabled={loading}>
                  {loading ? 'Memproses...' : 'Proses Pembayaran'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
