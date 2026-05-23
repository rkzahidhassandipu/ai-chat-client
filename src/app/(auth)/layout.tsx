'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace('/chat');
  }, [isAuthenticated, router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'var(--sidebar)',
        border: '1px solid var(--border)',
        borderRadius: 24,
        padding: '40px 36px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
      }}>
        {children}
      </div>
    </div>
  );
}
