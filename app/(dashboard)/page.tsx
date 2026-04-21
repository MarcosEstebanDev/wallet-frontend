'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getUserId } from '@/lib/auth';
import { useState } from 'react';

interface Account {
  id: string;
  userId: string;
  balance: string;
  currency: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const userId = getUserId();
  const [copied, setCopied] = useState(false);

  const { data: account, isLoading, isError, refetch } = useQuery<Account>({
    queryKey: ['balance'],
    queryFn: async () => {
      const { data } = await api.get('/accounts/balance');
      return data;
    },
  });

  function copyUserId() {
    if (!userId) return;
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
        <p className="mb-2">No se pudo cargar la cuenta.</p>
        <button onClick={() => refetch()} className="text-sm underline">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Saldo */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6">
        <p className="text-indigo-200 text-sm mb-1">Saldo disponible</p>
        <p className="text-4xl font-bold">
          {parseFloat(account!.balance).toLocaleString('es-AR', {
            style: 'currency',
            currency: account!.currency,
          })}
        </p>
        <p className="text-indigo-300 text-xs mt-2">{account!.currency}</p>
      </div>

      {/* Mi ID para recibir */}
      <div className="bg-gray-900 rounded-2xl p-4">
        <p className="text-gray-400 text-xs mb-2">Tu ID para recibir dinero</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-xs text-gray-300 truncate">
            {userId}
          </code>
          <button
            onClick={copyUserId}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs transition-colors shrink-0"
          >
            {copied ? '✅ Copiado' : '📋 Copiar'}
          </button>
        </div>
      </div>

      {/* Acciones */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => router.push('/transfer')}
          className="bg-gray-900 hover:bg-gray-800 rounded-2xl p-5 text-center transition-colors"
        >
          <div className="text-2xl mb-2">💸</div>
          <p className="text-sm font-medium">Transferir</p>
        </button>
        <button
          onClick={() => router.push('/history')}
          className="bg-gray-900 hover:bg-gray-800 rounded-2xl p-5 text-center transition-colors"
        >
          <div className="text-2xl mb-2">📋</div>
          <p className="text-sm font-medium">Historial</p>
        </button>
      </div>
    </div>
  );
}
