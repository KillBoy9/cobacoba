'use client';

import { useState } from 'react';
import LoginPage from './components/LoginPage';
import AppShell from './components/AppShell';

export type User = { id: number; username: string; role: string; name: string };

export default function Page() {
  const [user, setUser] = useState<User | null>(null);

  if (!user) return <LoginPage onLogin={setUser} />;
  return <AppShell user={user} onLogout={() => setUser(null)} />;
}
