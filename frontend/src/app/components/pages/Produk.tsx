'use client';

import { useEffect, useState, FormEvent } from 'react';

const API = 'http://localhost:5000';

type Product = { id: number; name: string; price: number; stock: number; category: string };

export default function Produk() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ id: 0, name: '', price: '', stock: '', category: '' });
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const res = await fetch(`${API}/api/products`);
    setProducts(await res.json());
  }

  function resetForm() {
    setForm({ id: 0, name: '', price: '', stock: '', category: '' });
    setMode('add');
  }

  function editProduct(product: Product) {
    setForm({ id: product.id, name: product.name, price: String(product.price), stock: String(product.stock), category: product.category });
    setMode('edit');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { name: form.name, price: Number(form.price), stock: Number(form.stock), category: form.category };
      const res = await fetch(`${API}/api/products${mode === 'edit' ? `/${form.id}` : ''}`, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        setToast(err.message || 'Gagal menyimpan produk.');
        setTimeout(() => setToast(''), 3000);
        return;
      }
      setToast(mode === 'edit' ? 'Produk berhasil diperbarui!' : 'Produk berhasil ditambahkan!');
      setTimeout(() => setToast(''), 3000);
      resetForm();
      loadProducts();
    } catch {
      setToast('Tidak dapat terhubung ke server.');
      setTimeout(() => setToast(''), 3000);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: number) {
    if (!confirm('Hapus produk ini?')) return;
    try {
      await fetch(`${API}/api/products/${id}`, { method: 'DELETE' });
      setToast('Produk berhasil dihapus!');
      setTimeout(() => setToast(''), 3000);
      loadProducts();
    } catch {
      setToast('Gagal menghapus produk.');
      setTimeout(() => setToast(''), 3000);
    }
  }

  const fmt = (n: number) => new Intl.NumberFormat('id-ID').format(n);

  return (
    <>
      <div className="page-title">
        <div>
          <p>Manajemen Inventori</p>
          <h1>Produk</h1>
          <small>Kelola produk dan stok barang</small>
        </div>
      </div>

      {toast && (
        <div className="toast-message">
          {toast}
          <button onClick={() => setToast('')}>×</button>
        </div>
      )}

      <div className="management-grid">
        <div className="panel">
          <h2>{mode === 'edit' ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
          <form className="product-form" onSubmit={handleSubmit} style={{ marginTop: 16 }}>
            <label>
              Nama Produk
              <input type="text" placeholder="Contoh: Kopi Hitam" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
              Kategori
              <input type="text" placeholder="Contoh: Minuman" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
            </label>
            <div className="form-row">
              <label>
                Harga (Rp)
                <input type="number" placeholder="15000" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} min="0" required />
              </label>
              <label>
                Stok
                <input type="number" placeholder="50" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} min="0" required />
              </label>
            </div>
            <div className="form-actions">
              {mode === 'edit' && (
                <button type="button" className="secondary-button" onClick={resetForm}>
                  Batal
                </button>
              )}
              <button type="submit" className="primary-button" disabled={loading}>
                {loading ? 'Menyimpan...' : mode === 'edit' ? 'Perbarui Produk' : 'Tambah Produk'}
              </button>
            </div>
          </form>
        </div>

        <div className="panel">
          <div className="section-heading" style={{ marginBottom: 0 }}>
            <div>
              <h2>Daftar Produk</h2>
              <p>{products.length} produk terdaftar</p>
            </div>
          </div>
          <div className="data-list">
            {products.length === 0 ? (
              <p className="empty-state">Belum ada produk. Tambahkan produk pertama Anda.</p>
            ) : (
              products.map(product => (
                <div className="data-row" key={product.id}>
                  <div>
                    <b>{product.name}</b>
                    <small>
                      {product.category} • Stok: {product.stock}
                    </small>
                  </div>
                  <strong>Rp {fmt(product.price)}</strong>
                  <div className="row-actions">
                    <button onClick={() => editProduct(product)}>Edit</button>
                    <button className="danger" onClick={() => deleteProduct(product.id)}>
                      Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
