'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function TransferPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ receiverId: '', amount: '', description: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      await api.post('/transactions/transfer', {
        receiverId: form.receiverId.trim(),
        amount: parseFloat(form.amount),
        ...(form.description ? { description: form.description } : {}),
      });
      await queryClient.invalidateQueries({ queryKey: ['balance'] });
      setStatus('success');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErrorMsg(msg || 'Error al realizar la transferencia');
      setStatus('error');
    }
  }

  if (status === 'success') return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16, padding: '0 8px' }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'linear-gradient(135deg, #059669, #10b981)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(16,185,129,0.35)'
      }}>
        <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>¡Transferencia exitosa!</h2>
        <p style={{ fontSize: 14, color: 'var(--muted)' }}>El dinero fue enviado correctamente.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320, marginTop: 8 }}>
        <button onClick={() => { setStatus('idle'); setForm({ receiverId: '', amount: '', description: '' }); }}
          style={{ width: '100%', padding: '14px', borderRadius: 14, fontSize: 14, fontWeight: 600, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}>
          Nueva transferencia
        </button>
        <button onClick={() => router.push('/')}
          style={{ width: '100%', padding: '14px', borderRadius: 14, fontSize: 14, fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: 'white', cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}>
          Ver saldo
        </button>
      </div>
    </div>
  );

  const inputStyle = {
    background: 'var(--surface-2)', border: '1px solid var(--border)',
    borderRadius: '14px', padding: '14px 16px', fontSize: '15px',
    color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s', width: '100%'
  } as React.CSSProperties;

  const labelStyle = {
    fontSize: '12px', fontWeight: 500, color: 'var(--muted)',
    letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: 6, display: 'block'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Enviar dinero</h1>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>Ingresá el ID del destinatario y el monto a enviar.</p>
      </div>

      {status === 'error' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, padding: '12px 16px', color: '#f87171', fontSize: 13 }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>ID del destinatario</label>
          <input type="text" required value={form.receiverId}
            onChange={e => setForm({ ...form, receiverId: e.target.value })}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 13 }}
            onFocus={e => (e.target.style.borderColor = '#6366f1')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        <div>
          <label style={labelStyle}>Monto (ARS)</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: 'var(--muted)', fontWeight: 600 }}>$</span>
            <input type="number" required min="0.01" step="0.01" value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              style={{ ...inputStyle, paddingLeft: 28 }}
              onFocus={e => (e.target.style.borderColor = '#6366f1')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Descripción <span style={{ textTransform: 'lowercase', opacity: 0.6 }}>(opcional)</span></label>
          <input type="text" value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Ej: Alquiler marzo"
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = '#6366f1')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        <button type="submit" disabled={status === 'loading'}
          style={{
            marginTop: 4, padding: '15px', borderRadius: 14, fontSize: 15, fontWeight: 600,
            background: status === 'loading' ? '#4338ca' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', color: 'white', cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            opacity: status === 'loading' ? 0.7 : 1, transition: 'all 0.2s',
            boxShadow: status === 'loading' ? 'none' : '0 4px 20px rgba(99,102,241,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
          {status === 'loading'
            ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'block' }} />Enviando...</>
            : <>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Enviar dinero
              </>
          }
        </button>
      </form>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
