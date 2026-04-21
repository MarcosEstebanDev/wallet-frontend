'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface Transaction {
  id: string;
  senderId: string;
  receiverId: string;
  amount: string;
  description?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

const statusConfig = {
  COMPLETED: { label: 'Completada', color: 'text-green-400 bg-green-900/30' },
  PENDING:   { label: 'Pendiente',  color: 'text-yellow-400 bg-yellow-900/30' },
  FAILED:    { label: 'Fallida',    color: 'text-red-400 bg-red-900/30' },
};

export default function HistoryPage() {
  const { data: transactions, isLoading, isError, refetch } = useQuery<Transaction[]>({
    queryKey: ['history'],
    queryFn: async () => {
      const { data } = await api.get('/transactions/history');
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-900/30 text-red-400 rounded-2xl p-6 text-center">
        <p className="mb-2">No se pudo cargar el historial.</p>
        <button onClick={() => refetch()} className="text-sm underline">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">📋 Historial</h1>

      {!transactions?.length ? (
        <div className="bg-gray-900 rounded-2xl p-8 text-center text-gray-500">
          No hay transacciones todavía.
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => {
            const cfg = statusConfig[tx.status] ?? statusConfig.PENDING;
            return (
              <div key={tx.id} className="bg-gray-900 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>
                    {cfg.label}
                  </span>
                  <span className="text-lg font-semibold text-indigo-300">
                    {parseFloat(tx.amount).toLocaleString('es-AR', {
                      style: 'currency',
                      currency: 'ARS',
                    })}
                  </span>
                </div>
                {tx.description && (
                  <p className="text-sm text-gray-300 mb-1">{tx.description}</p>
                )}
                <div className="text-xs text-gray-500 space-y-0.5">
                  <p>De: <span className="font-mono">{tx.senderId.slice(0, 8)}…</span></p>
                  <p>A: <span className="font-mono">{tx.receiverId.slice(0, 8)}…</span></p>
                  <p>{new Date(tx.createdAt).toLocaleString('es-AR')}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
