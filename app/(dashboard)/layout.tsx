'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { clearAuth } from '@/lib/auth';

const P = '#009ee3';
const M = '#a0aec0';

const navItems = [
  {
    href: '/',
    label: 'Inicio',
    icon: (a: boolean) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M3 12L12 3l9 9" stroke={a?P:M} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9" stroke={a?P:M} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: '/deposit',
    label: 'Cargar',
    icon: (a: boolean) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke={a?P:M} strokeWidth="1.8"/>
        <line x1="12" y1="8" x2="12" y2="16" stroke={a?P:M} strokeWidth="2" strokeLinecap="round"/>
        <line x1="8" y1="12" x2="16" y2="12" stroke={a?P:M} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/transfer',
    label: 'Enviar',
    icon: (a: boolean) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M22 2L11 13" stroke={a?P:M} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 2L15 22l-4-9-9-4 20-7z" stroke={a?P:M} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: '/history',
    label: 'Actividad',
    icon: (a: boolean) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke={a?P:M} strokeWidth="1.8"/>
        <path d="M12 6v6l4 2" stroke={a?P:M} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', maxWidth: '430px', margin: '0 auto', position: 'relative' }}>
      {/* Top bar */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px 12px', position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        boxShadow: '0 1px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #009ee3, #0080c0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <rect x="2" y="6" width="20" height="13" rx="3" stroke="white" strokeWidth="1.8"/>
              <path d="M2 10h20" stroke="white" strokeWidth="1.8"/>
              <rect x="5" y="14" width="4" height="2" rx="1" fill="white"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>Wallet</span>
        </div>
        <button onClick={() => { clearAuth(); router.push('/login'); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '6px 12px', cursor: 'pointer',
            color: 'var(--muted)', fontSize: 13, fontWeight: 500
          }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Salir
        </button>
      </header>

      {/* Page content */}
      <main style={{ padding: '16px 16px 110px' }}>
        {children}
      </main>

      {/* Bottom Nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430, background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '6px 8px 16px' }}>
          {navItems.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '8px 12px', borderRadius: 12, textDecoration: 'none',
                transition: 'background 0.15s'
              }}>
                {icon(active)}
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.02em',
                  color: active ? '#009ee3' : '#a0aec0'
                }}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
