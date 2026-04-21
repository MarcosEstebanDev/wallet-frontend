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
      // Invalida el cache del balance para que se actualice en dashboard
      await queryClient.invalidateQueries({ queryKey: ['balance'] });
      setStatus('success');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErrorMsg(msg || 'Error al realizar la transferencia');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-5xl">✅</div>
        <h2 className="text-xl font-semibold">¡Transferencia exitosa!</h2>
        <p className="text-gray-400 text-sm">El dinero fue enviado correctamente.</p>
        <div className="flex gap-3 justify-center mt-4">
          <button
            onClick={() => { setStatus('idle'); setForm({ receiverId: '', amount: '', description: '' }); }}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
          >
            Nueva transferencia
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm transition-colors"
          >
            Ver saldo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">💸 Transferir</h1>
        <p className="text-gray-400 text-sm mt-1">
          Pedile al destinatario su ID de usuario para enviarle dinero.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-6 space-y-4">
        {status === 'error' && (
          <p className="bg-red-900/40 text-red-400 text-sm px-3 py-2 rounded-lg">{errorMsg}</p>
        )}

        <div>
          <label className="block text-sm text-gray-400 mb-1">ID del destinatario</label>
          <input
            type="text"
            required
            value={form.receiverId}
            onChange={(e) => setForm({ ...form, receiverId: e.target.value })}
            className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Monto (ARS)</label>
          <input
            type="number"
            required
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Descripción (opcional)</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej: Alquiler marzo"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg py-2 text-sm font-medium transition-colors"
        >
          {status === 'loading' ? 'Enviando...' : 'Enviar dinero'}
        </button>
      </form>
    </div>
  );
}
