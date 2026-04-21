'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { saveAuth } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      const { data } = await api.post('/auth/login', { email: form.email, password: form.password });
      saveAuth({ token: data.token, userId: data.userId });
      await api.post('/accounts');
      router.push('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { key: 'name',     label: 'Nombre completo', type: 'text',     placeholder: 'Juan Pérez',        autocomplete: 'name' },
    { key: 'email',    label: 'Email',            type: 'email',    placeholder: 'tu@email.com',      autocomplete: 'email' },
    { key: 'password', label: 'Contraseña',       type: 'password', placeholder: 'Mínimo 6 caracteres', autocomplete: 'new-password' },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="relative flex flex-col items-center justify-center pt-20 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 70%)'
        }} />
        <div className="relative flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 8px 32px rgba(99,102,241,0.4)'
          }}>
            <svg width="30" height="30" fill="none" viewBox="0 0 24 24">
              <rect x="2" y="6" width="20" height="13" rx="3" stroke="white" strokeWidth="1.8"/>
              <path d="M2 10h20" stroke="white" strokeWidth="1.8"/>
              <rect x="5" y="14" width="4" height="2" rx="1" fill="white"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>Wallet</h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Creá tu cuenta gratis</p>
        </div>
      </div>

      <div className="flex-1 rounded-t-[28px] px-6 pt-8 pb-8" style={{ background: 'var(--surface)' }}>
        <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text)' }}>Registrate</h2>

        {error && (
          <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-2xl text-sm" style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171'
          }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map(({ key, label, type, placeholder, autocomplete }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</label>
              <input
                type={type} required autoComplete={autocomplete}
                minLength={key === 'password' ? 6 : undefined}
                value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                style={{
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  borderRadius: '14px', padding: '14px 16px', fontSize: '15px',
                  color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s', width: '100%'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          ))}

          <button type="submit" disabled={loading}
            style={{
              marginTop: '4px',
              background: loading ? '#4338ca' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '14px', padding: '15px', fontSize: '15px', fontWeight: 600,
              color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'all 0.2s', width: '100%',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.35)'
            }}>
            {loading
              ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'block' }} />
                  Creando cuenta...
                </span>
              : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center mt-6" style={{ fontSize: '14px', color: 'var(--muted)' }}>
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" style={{ color: 'var(--primary-2)', fontWeight: 500 }}>
            Ingresá
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
