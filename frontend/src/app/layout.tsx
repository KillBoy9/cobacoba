import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kasirku — Dashboard POS',
  description: 'Kelola transaksi dan pantau bisnis Anda dengan Kasirku.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
