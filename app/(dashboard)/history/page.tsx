'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { getUserId } from '@/lib/auth';

interface Transaction {
  id: string; senderId: string; receiverId: string;
  amount: string; description?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED'; createdAt: string;
}

function ArrowUp() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
      <path d="M12 19V5m-7 7 7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function ArrowDown() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
      <path d="M12 5v14m7-7-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function HistoryPage() {
  const userId = getUserId();

  const { data: transactions, isLoading, isError, refetch } = useQuery<Transaction[]>({
    queryKey: ['history'],
    queryFn: async () => (await api.get('/transactions/history')).data,
  });

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <div style={{ width: 28, height: 28, border: '2px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (isError) return (
    <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, padding: 24, textAlign: 'center', color: '#f87171', marginTop: 16 }}>
      <p style={{ marginBottom: 8, fontSize: 14 }}>No se pudo cargar el historial.</p>
      <button onClick={() => refetch()} style={{ fontSize: 12, textDecoration: 'underline', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>Reintentar</button>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>Actividad</h1>
        {transactions?.length ? (
          <span style={{ fontSize: 12, color: 'var(--muted)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '3px 10px' }}>
            {transactions.length} movimientos
          </span>
        ) : null}
      </div>

      {!transactions?.length ? (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" style={{ margin: '0 auto', display: 'block' }}>
              <circle cx="12" cy="12" r="10" stroke="#64748b" strokeWidth="1.5"/>
              <path d="M12 6v6l4 2" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--muted)', marginBottom: 4 }}>Sin movimientos</p>
          <p style={{ fontSize: 13, color: 'rgba(100,116,139,0.6)' }}>Las transferencias aparecerán aquí</p>
        </div>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
          {transactions.map((tx, idx) => {
            const isOut = tx.senderId === userId;
            const amount = parseFloat(tx.amount).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });
            const date = new Date(tx.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
            const time = new Date(tx.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
            const isFailed = tx.status === 'FAILED';
            const isPending = tx.status === 'PENDING';

            return (
              <div key={tx.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px',
                borderBottom: idx < transactions.length - 1 ? '1px solid var(--border)' : 'none'
              }}>
                {/* Icon */}
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isFailed
                    ? 'rgba(239,68,68,0.12)'
                    : isOut ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)',
                  color: isFailed
                    ? '#f87171'
                    : isOut ? '#f87171' : '#4ade80'
                }}>
                  {isOut ? <ArrowUp /> : <ArrowDown />}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tx.description || (isOut ? 'Transferencia enviada' : 'Transferencia recibida')}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {isOut
                      ? `A: ${tx.receiverId.slice(0, 8)}…`
                      : `De: ${tx.senderId.slice(0, 8)}…`
                    } · {date}, {time}
                  </p>
                  {isPending && (
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#fbbf24', background: 'rgba(251,191,36,0.1)', borderRadius: 6, padding: '1px 6px', display: 'inline-block', marginTop: 3 }}>
                      PENDIENTE
                    </span>
                  )}
                  {isFailed && (
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#f87171', background: 'rgba(239,68,68,0.1)', borderRadius: 6, padding: '1px 6px', display: 'inline-block', marginTop: 3 }}>
                      FALLIDA
                    </span>
                  )}
                </div>

                {/* Amount */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{
                    fontSize: 15, fontWeight: 700,
                    color: isFailed ? '#f87171' : isOut ? '#f1f5f9' : '#4ade80'
                  }}>
                    {isOut ? '-' : '+'}{amount}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
