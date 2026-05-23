'use client';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import { useLogout } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { Avatar } from '@/components/ui/Avatar';

// ✅ Type define kora — isTheme optional
interface SettingsItem {
  icon: string;
  label: string;
  href: string;
  isTheme?: boolean;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    title: 'Account',
    items: [
      { icon: '👤', label: 'Edit Profile', href: '/profile' },
      { icon: '🔒', label: 'Change Password', href: '/profile?tab=password' },
      { icon: '📧', label: 'Email Preferences', href: '#' },
    ],
  },
  {
    title: 'Privacy',
    items: [
      { icon: '🚫', label: 'Blocked Users', href: '#' },
      { icon: '👁️', label: 'Who can see me online', href: '#' },
    ],
  },
  {
    title: 'Notifications',
    items: [
      { icon: '🔔', label: 'Message Notifications', href: '#' },
      { icon: '📳', label: 'Sound & Vibration', href: '#' },
    ],
  },
  {
    title: 'Appearance',
    items: [
      { icon: '🌙', label: 'Theme', href: '#', isTheme: true },
    ],
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const logout = useLogout();
  const { user } = useAuthStore();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--sidebar)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '7px 12px',
            cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14,
          }}
        >← Back</button>
        <span style={{ color: 'var(--text)', fontWeight: 700, fontSize: 16 }}>Settings</span>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px' }}>

        {/* User card */}
        {user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px 20px',
            background: 'var(--sidebar)', borderRadius: 16,
            border: '1px solid var(--border)', marginBottom: 24,
          }}>
            <Avatar name={user.name} src={user.avatar} size={52} radius={16} status={user.status} showStatus />
            <div>
              <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 15 }}>{user.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{user.email}</div>
            </div>
          </div>
        )}

        {/* Settings sections */}
        {SETTINGS_SECTIONS.map((section) => (
          <div key={section.title} style={{ marginBottom: 20 }}>
            <div style={{
              color: 'var(--text-muted)', fontSize: 11,
              fontWeight: 700, letterSpacing: 0.8,
              textTransform: 'uppercase', padding: '0 4px',
              marginBottom: 8,
            }}>{section.title}</div>

            <div style={{
              background: 'var(--sidebar)', borderRadius: 14,
              border: '1px solid var(--border)', overflow: 'hidden',
            }}>
              {section.items.map((item, idx) => (
                <div
                  key={item.label}
                  onClick={() => item.href !== '#' && router.push(item.href)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderBottom: idx < section.items.length - 1 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer', transition: 'background 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span style={{ color: 'var(--text)', fontSize: 14 }}>{item.label}</span>
                  </div>

                  {item.isTheme ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleTheme(); }}
                      style={{
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: 20, padding: '4px 12px',
                        cursor: 'pointer', fontSize: 12,
                        color: 'var(--text)', fontWeight: 600,
                      }}
                    >{isDark ? '☀️ Light' : '🌙 Dark'}</button>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>›</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <button
          onClick={() => logout.mutate()}
          style={{
            width: '100%', padding: '14px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 14, cursor: 'pointer',
            color: '#f87171', fontSize: 14, fontWeight: 600,
          }}
        >🚪 Sign Out</button>
      </div>
    </div>
  );
}