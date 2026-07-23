const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');
require('dotenv').config();

const app = express();
const port = Number(process.env.PORT || 5000);
const dataDirectory = path.join(__dirname, 'data');
fs.mkdirSync(dataDirectory, { recursive: true });
const db = new DatabaseSync(path.join(dataDirectory, 'pos.db'));

app.use(cors());
app.use(express.json());

db.exec(`
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL, name TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, price INTEGER NOT NULL CHECK(price >= 0), stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0), category TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT UNIQUE, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, invoice TEXT UNIQUE NOT NULL, total INTEGER NOT NULL, customer_id INTEGER, cashier TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'Selesai', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(customer_id) REFERENCES customers(id));
  CREATE TABLE IF NOT EXISTS order_items (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL, product_id INTEGER, name TEXT NOT NULL, price INTEGER NOT NULL, quantity INTEGER NOT NULL, FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE, FOREIGN KEY(product_id) REFERENCES products(id));
  CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
`);

const count = (table) => db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count;
if (count('users') === 0) db.prepare('INSERT INTO users (id, username, password, role, name) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)').run(1, 'admin', 'admin123', 'admin', 'Admin POS', 2, 'kasir', 'kasir123', 'kasir', 'Kasir POS');
if (count('products') === 0) {
  const insert = db.prepare('INSERT INTO products (name, price, stock, category) VALUES (?, ?, ?, ?)');
  [['Kopi Hitam', 12000, 25, 'Minuman'], ['Nasi Goreng', 28000, 15, 'Makanan'], ['Mie Ayam', 22000, 10, 'Makanan'], ['Teh Manis', 8000, 30, 'Minuman'], ['Roti Bakar', 18000, 18, 'Makanan'], ['Es Jeruk', 10000, 22, 'Minuman']].forEach((product) => insert.run(...product));
}
if (count('settings') === 0) {
  const insert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
  [['storeName', 'Kasirku Demo'], ['address', 'Jl. Merdeka No. 12, Jakarta'], ['phone', '0812-3456-7890'], ['tax', '0'], ['currency', 'IDR']].forEach(([key, value]) => insert.run(key, value));
}

const queryProducts = () => db.prepare('SELECT id, name, price, stock, category FROM products ORDER BY id DESC').all();
const invoice = () => `TRX-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${String(Date.now()).slice(-5)}`;
const currentSettings = () => Object.fromEntries(db.prepare('SELECT key, value FROM settings').all().map(({ key, value }) => [key, value]));

app.get('/api/health', (_req, res) => res.json({ ok: true, message: 'POS API is running', database: 'SQLite' }));

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = db.prepare('SELECT id, username, role, name FROM users WHERE username = ? AND password = ?').get(username, password);
  if (!user) return res.status(401).json({ message: 'Username atau password tidak sesuai.' });
  return res.json({ user });
});

app.get('/api/dashboard', (_req, res) => {
  const totals = db.prepare(`SELECT COALESCE(SUM(total), 0) revenue, COUNT(*) orders FROM orders WHERE date(created_at, 'localtime') = date('now', 'localtime')`).get();
  const recentOrders = db.prepare('SELECT id, invoice, total, created_at AS createdAt, cashier, status FROM orders ORDER BY id DESC LIMIT 5').all();
  res.json({ totals: { revenue: totals.revenue, orders: totals.orders, customers: count('customers'), products: count('products') }, recentOrders });
});

app.get('/api/products', (_req, res) => res.json(queryProducts()));
app.post('/api/products', (req, res) => {
  const { name, price, stock, category } = req.body || {};
  if (!name || !category || Number(price) < 0 || Number(stock) < 0) return res.status(400).json({ message: 'Nama, kategori, harga, dan stok harus valid.' });
  const result = db.prepare('INSERT INTO products (name, price, stock, category) VALUES (?, ?, ?, ?)').run(name.trim(), Number(price), Number(stock), category.trim());
  res.status(201).json(db.prepare('SELECT id, name, price, stock, category FROM products WHERE id = ?').get(result.lastInsertRowid));
});
app.put('/api/products/:id', (req, res) => {
  const { name, price, stock, category } = req.body || {};
  const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
  if (!name || !category || Number(price) < 0 || Number(stock) < 0) return res.status(400).json({ message: 'Data produk tidak valid.' });
  db.prepare('UPDATE products SET name = ?, price = ?, stock = ?, category = ? WHERE id = ?').run(name.trim(), Number(price), Number(stock), category.trim(), req.params.id);
  res.json(db.prepare('SELECT id, name, price, stock, category FROM products WHERE id = ?').get(req.params.id));
});
app.delete('/api/products/:id', (req, res) => {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  if (!result.changes) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
  return res.status(204).end();
});

app.get('/api/orders', (_req, res) => {
  const orders = db.prepare(`SELECT o.id, o.invoice, o.total, o.cashier, o.status, o.created_at AS createdAt, COALESCE(c.name, 'Pelanggan umum') customer FROM orders o LEFT JOIN customers c ON c.id = o.customer_id ORDER BY o.id DESC`).all();
  res.json(orders);
});
app.post('/api/orders', (req, res) => {
  const { items, cashier, customer } = req.body || {};
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: 'Keranjang tidak boleh kosong.' });
  const validated = items.map((item) => {
    const product = db.prepare('SELECT id, name, price, stock FROM products WHERE id = ?').get(item.id);
    if (!product || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > product.stock) throw new Error(product ? `Stok ${product.name} tidak mencukupi.` : 'Produk tidak ditemukan.');
    return { ...product, quantity: item.quantity };
  });
  const total = validated.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let customerId = null;
  try {
    db.exec('BEGIN');
    if (customer?.name?.trim()) {
      const found = customer.phone ? db.prepare('SELECT id FROM customers WHERE phone = ?').get(customer.phone.trim()) : null;
      customerId = found?.id || db.prepare('INSERT INTO customers (name, phone) VALUES (?, ?)').run(customer.name.trim(), customer.phone?.trim() || null).lastInsertRowid;
    }
    const order = db.prepare('INSERT INTO orders (invoice, total, customer_id, cashier) VALUES (?, ?, ?, ?)').run(invoice(), total, customerId, cashier || 'Kasir');
    const addItem = db.prepare('INSERT INTO order_items (order_id, product_id, name, price, quantity) VALUES (?, ?, ?, ?, ?)');
    const reduceStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
    validated.forEach((item) => { addItem.run(order.lastInsertRowid, item.id, item.name, item.price, item.quantity); reduceStock.run(item.quantity, item.id); });
    db.exec('COMMIT');
    res.status(201).json({ success: true, order: { id: Number(order.lastInsertRowid), invoice: db.prepare('SELECT invoice FROM orders WHERE id = ?').get(order.lastInsertRowid).invoice, total } });
  } catch (error) { db.exec('ROLLBACK'); res.status(400).json({ message: error.message || 'Transaksi tidak dapat diproses.' }); }
});

app.get('/api/reports', (_req, res) => {
  const summary = db.prepare(`SELECT COALESCE(SUM(total), 0) revenue, COUNT(*) orders, COALESCE(AVG(total), 0) average FROM orders WHERE date(created_at) >= date('now', '-6 days')`).get();
  const daily = db.prepare(`SELECT date(created_at) date, COALESCE(SUM(total), 0) revenue, COUNT(*) orders FROM orders WHERE date(created_at) >= date('now', '-6 days') GROUP BY date(created_at) ORDER BY date`).all();
  const products = db.prepare(`SELECT oi.name, SUM(oi.quantity) quantity, SUM(oi.price * oi.quantity) revenue FROM order_items oi GROUP BY oi.name ORDER BY quantity DESC LIMIT 5`).all();
  res.json({ summary, daily, products });
});

app.get('/api/settings', (_req, res) => res.json(currentSettings()));
app.put('/api/settings', (req, res) => {
  const allowed = ['storeName', 'address', 'phone', 'tax', 'currency'];
  const update = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
  allowed.forEach((key) => { if (req.body?.[key] !== undefined) update.run(key, String(req.body[key])); });
  res.json(currentSettings());
});

app.listen(port, () => console.log(`POS API running on http://localhost:${port} (SQLite: backend/data/pos.db)`));
