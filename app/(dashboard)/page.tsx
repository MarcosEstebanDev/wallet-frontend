'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getUserId } from '@/lib/auth';
import { useState } from 'react';

interface Account { id: string; userId: string; balance: string; currency: string; }

export default function DashboardPage() {
  const router = useRouter();
  const userId = getUserId();
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);

  const { data: account, isLoading, isError, refetch } = useQuery<Account>({
    queryKey: ['balance'],
    queryFn: async () => (await api.get('/accounts/balance')).data,
  });

  function copyId() {
    if (!userId) return;
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const fmt = (n: string, cur: string) =>
    parseFloat(n).toLocaleString('es-AR', { style: 'currency', currency: cur, minimumFractionDigits: 2 });

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260 }}>
      <div style={{ width: 28, height: 28, border: '2px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (isError) return (
    <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, padding: 24, textAlign: 'center', color: '#f87171', marginTop: 16 }}>
      <p style={{ marginBottom: 8, fontSize: 14 }}>No se pudo cargar la cuenta.</p>
      <button onClick={() => refetch()} style={{ fontSize: 12, textDecoration: 'underline', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>Reintentar</button>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Balance card */}
      <div style={{
        borderRadius: 24, padding: '28px 24px 24px',
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #009ee3 0%, #0070b8 100%)',
        boxShadow: '0 12px 40px rgba(0,158,227,0.3)'
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -20, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Saldo disponible
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setShowBalance(v => !v)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', color: 'white', lineHeight: 0 }}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                  {showBalance
                    ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></>
                    : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></>
                  }
                </svg>
              </button>
              <button onClick={() => refetch()} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', color: 'white', fontSize: 14, lineHeight: 1 }}>
                ↻
              </button>
            </div>
          </div>

          <p style={{ fontSize: 42, fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 18 }}>
            {showBalance ? fmt(account!.balance, account!.currency) : '$ ••••••'}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.12)', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
              {account!.currency}
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>· Cuenta activa</span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[
          {
            label: 'Cargar', sub: 'Agregar fondos',
            action: () => router.push('/deposit'),
            icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#009ee3" strokeWidth="2"/><line x1="12" y1="8" x2="12" y2="16" stroke="#009ee3" strokeWidth="2.2" strokeLinecap="round"/><line x1="8" y1="12" x2="16" y2="12" stroke="#009ee3" strokeWidth="2.2" strokeLinecap="round"/></svg>,
            bg: 'rgba(0,158,227,0.07)', bord: 'rgba(0,158,227,0.18)'
          },
          {
            label: 'Enviar', sub: 'Transferir',
            action: () => router.push('/transfer'),
            icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M22 2L11 13" stroke="#009ee3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 2L15 22l-4-9-9-4 20-7z" stroke="#009ee3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
            bg: 'rgba(0,158,227,0.07)', bord: 'rgba(0,158,227,0.18)'
          },
          {
            label: 'Actividad', sub: 'Movimientos',
            action: () => router.push('/history'),
            icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#009ee3" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="#009ee3" strokeWidth="2" strokeLinecap="round"/></svg>,
            bg: 'rgba(0,158,227,0.07)', bord: 'rgba(0,158,227,0.18)'
          },
        ].map(({ label, sub, action, icon, bg, bord }) => (
          <button key={label} onClick={action} style={{
            background: bg, border: `1px solid ${bord}`, borderRadius: 16,
            padding: '14px 10px', textAlign: 'center', cursor: 'pointer',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ marginBottom: 8, lineHeight: 0, display: 'flex', justifyContent: 'center' }}>{icon}</div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{label}</p>
            <p style={{ fontSize: 10, color: 'var(--muted)' }}>{sub}</p>
          </button>
        ))}
      </div>

      {/* My ID */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: '16px 18px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
          Tu ID para recibir fondos
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px', overflow: 'hidden' }}>
            <code style={{ fontSize: 11, color: '#94a3b8', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userId}
            </code>
          </div>
          <button onClick={copyId} style={{
            flexShrink: 0,
            background: copied ? 'rgba(34,197,94,0.15)' : 'var(--surface-2)',
            border: `1px solid ${copied ? 'rgba(34,197,94,0.35)' : 'var(--border)'}`,
            borderRadius: 10, padding: '10px 14px', cursor: 'pointer',
            color: copied ? '#4ade80' : 'var(--muted)', fontSize: 12, fontWeight: 600,
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 5
          }}>
            {copied
              ? <><svg width="13" height="13" fill="none" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>Copiado</>
              : <><svg width="13" height="13" fill="none" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.8"/></svg>Copiar</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
