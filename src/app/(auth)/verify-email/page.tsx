'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service';

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const token = params.get('token') || '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token) { setStatus('error'); return; }
    authService.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="w-full text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl text-2xl mb-6 shadow-xl shadow-indigo-500/30">
        ✉️
      </div>

      {status === 'loading' && (
        <>
          <div className="inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[var(--text-muted)] text-sm">Verifying your email...</p>
        </>
      )}

      {status === 'success' && (
        <>
          <h1 className="text-xl font-700 text-[var(--text)] mb-2">Email Verified! ✅</h1>
          <p className="text-sm text-[var(--text-muted)] mb-6">Your account is now active.</p>
          <Link href="/login">
            <button className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white px-6 py-2.5 rounded-xl font-600 text-sm">
              Sign In →
            </button>
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <h1 className="text-xl font-700 text-red-400 mb-2">Verification Failed</h1>
          <p className="text-sm text-[var(--text-muted)] mb-6">Invalid or expired link.</p>
          <Link href="/register" className="text-indigo-400 text-sm">← Back to Register</Link>
        </>
      )}
    </div>
  );
}
