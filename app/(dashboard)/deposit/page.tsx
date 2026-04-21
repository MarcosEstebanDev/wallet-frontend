'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000];

export default function DepositPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await api.post('/accounts/deposit', { amount: value });
      await queryClient.invalidateQueries({ queryKey: ['balance'] });
      setStatus('success');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErrorMsg(msg || 'Error al cargar el saldo');
      setStatus('error');
    }
  }

  if (status === 'success') return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16, padding: '0 8px' }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'linear-gradient(135deg, #00b341, #00d155)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(0,179,65,0.3)'
      }}>
        <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>¡Saldo acreditado!</h2>
        <p style={{ fontSize: 14, color: 'var(--muted)' }}>
          Tu saldo fue actualizado correctamente.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320, marginTop: 8 }}>
        <button onClick={() => { setStatus('idle'); setAmount(''); }}
          style={{ width: '100%', padding: '14px', borderRadius: 14, fontSize: 14, fontWeight: 600, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}>
          Cargar más saldo
        </button>
        <button onClick={() => router.push('/')}
          style={{ width: '100%', padding: '14px', borderRadius: 14, fontSize: 14, fontWeight: 600, background: 'linear-gradient(135deg, #009ee3, #0080c0)', border: 'none', color: 'white', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,158,227,0.3)' }}>
          Ver saldo
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Cargar saldo</h1>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>Ingresá el monto que querés agregar a tu cuenta.</p>
      </div>

      {status === 'error' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(229,57,53,0.06)', border: '1px solid rgba(229,57,53,0.2)', borderRadius: 14, padding: '12px 16px', color: '#e53935', fontSize: 13 }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Amount input */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: '24px 20px', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
            Monto a cargar
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: amount ? 'var(--text)' : '#b0bec5' }}>$</span>
            <input
              type="number" min="0.01" step="0.01" required
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              style={{
                fontSize: 48, fontWeight: 800, color: 'var(--text)',
                background: 'transparent', border: 'none', outline: 'none',
                width: '100%', textAlign: 'center', letterSpacing: '-0.02em'
              }}
            />
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>ARS</p>
        </div>

        {/* Quick amounts */}
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
            Montos rápidos
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {QUICK_AMOUNTS.map(q => (
              <button key={q} type="button"
                onClick={() => setAmount(String(q))}
                style={{
                  padding: '9px 16px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s',
                  background: amount === String(q) ? 'rgba(0,158,227,0.1)' : 'var(--surface)',
                  border: `1px solid ${amount === String(q) ? '#009ee3' : 'var(--border)'}`,
                  color: amount === String(q) ? '#009ee3' : 'var(--text)',
                  boxShadow: amount === String(q) ? 'none' : 'var(--shadow)'
                }}>
                ${q.toLocaleString('es-AR')}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={status === 'loading' || !amount}
          style={{
            padding: '15px', borderRadius: 14, fontSize: 15, fontWeight: 600,
            background: !amount || status === 'loading' ? '#b0bec5' : 'linear-gradient(135deg, #009ee3, #0080c0)',
            border: 'none', color: 'white',
            cursor: !amount || status === 'loading' ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: !amount || status === 'loading' ? 'none' : '0 4px 20px rgba(0,158,227,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
          {status === 'loading'
            ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'block' }} />Procesando...</>
            : <>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                Cargar saldo
              </>
          }
        </button>
      </form>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}
