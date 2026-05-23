'use client';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';
import { Avatar } from '@/components/ui/Avatar';
import { useLogout } from '@/hooks/useAuth';

export type NavTab = 'messages' | 'groups' | 'friends' | 'profile' | 'settings';

interface RightNavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const NAV_ITEMS: { id: NavTab; icon: string; label: string }[] = [
  { id: 'messages', icon: '💬', label: 'Messages' },
  { id: 'groups', icon: '👥', label: 'Groups' },
  { id: 'friends', icon: '➕', label: 'Add Friend' },
  { id: 'profile', icon: '👤', label: 'Profile' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];

export function RightNavbar({ activeTab, onTabChange }: RightNavbarProps) {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuthStore();
  const logout = useLogout();

  return (
    <aside
      style={{
        width: 64,
        background: 'var(--nav)',
        borderLeft: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 0',
        gap: 4,
        flexShrink: 0,
        boxShadow: isDark ? '-4px 0 24px rgba(0,0,0,0.3)' : '-2px 0 12px rgba(0,0,0,0.06)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: 40, height: 40,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, marginBottom: 16,
          boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
          flexShrink: 0,
        }}
      >💬</div>

      {/* Nav items */}
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          title={item.label}
          style={{
            width: 44, height: 44,
            background: activeTab === item.id ? 'var(--accent-glow)' : 'transparent',
            border: activeTab === item.id ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
            borderRadius: 12,
            cursor: 'pointer',
            fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          {item.icon}
          {activeTab === item.id && (
            <div style={{
              position: 'absolute', right: -1,
              width: 3, height: 18,
              background: 'var(--accent)',
              borderRadius: '3px 0 0 3px',
            }} />
          )}
        </button>
      ))}

      <div style={{ flex: 1 }} />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        title="Toggle theme"
        style={{
          width: 44, height: 44,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          cursor: 'pointer',
          fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 4,
          flexShrink: 0,
        }}
      >{isDark ? '☀️' : '🌙'}</button>

      {/* Logout */}
      <button
        onClick={() => logout.mutate()}
        title="Logout"
        style={{
          width: 44, height: 44,
          background: 'transparent',
          border: '1px solid transparent',
          borderRadius: 12,
          cursor: 'pointer',
          fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 8,
          flexShrink: 0,
          opacity: 0.6,
        }}
      >🚪</button>

      {/* My avatar */}
      {user && (
        <Avatar
          name={user.name}
          src={user.avatar}
          size={36}
          radius={10}
          status={user.status}
          showStatus
        />
      )}
    </aside>
  );
}
