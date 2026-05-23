'use client';
import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { formatFileSize } from '@/lib/utils';

const MOCK_IMAGES = [
  { id: 1, color: '#6366f130' }, { id: 2, color: '#8b5cf630' },
  { id: 3, color: '#ec489930' }, { id: 4, color: '#06b6d430' },
  { id: 5, color: '#22c55e30' }, { id: 6, color: '#f59e0b30' },
];

const MOCK_FILES = [
  { id: 1, name: 'project-brief.pdf', size: 2516582, icon: '📄', date: 'Today' },
  { id: 2, name: 'wireframes-v2.fig', size: 8493465, icon: '🎨', date: 'Yesterday' },
  { id: 3, name: 'meeting-notes.docx', size: 131072, icon: '📝', date: 'Mon' },
  { id: 4, name: 'data-export.xlsx', size: 1258291, icon: '📊', date: 'Last week' },
];

type ProfileTab = 'about' | 'images' | 'files';

interface ProfilePanelProps {
  user: { id: string; name: string; avatar?: string | null; status?: string; preferredLanguage?: string; bio?: string } | null;
}

export function ProfilePanel({ user }: ProfilePanelProps) {
  const [tab, setTab] = useState<ProfileTab>('about');

  if (!user) {
    return (
      <aside style={{
        width: 280, background: 'var(--sidebar)',
        borderLeft: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No chat selected</div>
      </aside>
    );
  }

  return (
    <aside style={{
      width: 280,
      background: 'var(--sidebar)',
      borderLeft: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflowY: 'auto',
    }}>
      {/* Profile Header */}
      <div style={{
        padding: '24px 20px 16px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        borderBottom: '1px solid var(--border)',
        background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.08) 0%, transparent 70%)',
      }}>
        <Avatar name={user.name} src={user.avatar} size={72} radius={22} status={user.status as any} showStatus />

        <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 16, letterSpacing: -0.3, marginTop: 12 }}>
          {user.name}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>
          {user.bio || 'AI Chat User'}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <div style={{
            width: 7, height: 7,
            background: user.status === 'ONLINE' ? '#22c55e' : user.status === 'AWAY' ? '#f59e0b' : '#52525b',
            borderRadius: '50%',
          }} />
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{user.status || 'OFFLINE'}</span>
          {user.preferredLanguage && (
            <>
              <span style={{ color: 'var(--text-muted)' }}>·</span>
              <span style={{
                background: 'var(--accent-glow)', border: '1px solid rgba(99,102,241,0.25)',
                borderRadius: 6, padding: '1px 7px',
                color: 'var(--accent)', fontSize: 11, fontWeight: 600,
              }}>🌐 {user.preferredLanguage}</span>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          {[['📞', 'Call'], ['📹', 'Video'], ['🚫', 'Block']].map(([icon, label]) => (
            <button key={label} title={label} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '7px 12px',
              cursor: 'pointer', fontSize: 15,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <span>{icon}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 12px',
        flexShrink: 0,
      }}>
        {(['about', 'images', 'files'] as ProfileTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '11px 4px',
              background: 'transparent', border: 'none',
              borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
              color: tab === t ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: 12, fontWeight: tab === t ? 700 : 500,
              cursor: 'pointer', transition: 'all 0.15s',
              textTransform: 'capitalize',
            }}
          >{t}</button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>

        {/* About */}
        {tab === 'about' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              ['📧', 'Email', `${user.name.split(' ')[0].toLowerCase()}@example.com`],
              ['🌐', 'Language', user.preferredLanguage || 'EN'],
              ['👥', 'Mutual Friends', '12 friends'],
              ['📅', 'Member Since', 'Jan 2024'],
            ].map(([icon, label, value]) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px',
                background: 'var(--surface)', borderRadius: 10,
                border: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
                  <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 500 }}>{value}</div>
                </div>
              </div>
            ))}

            {/* Media summary */}
            <div style={{
              padding: '10px 12px',
              background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--border)',
            }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                Shared Media
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[['🖼️', '6', 'Photos'], ['📄', '4', 'Files'], ['🎵', '0', 'Audio']].map(([icon, count, label]) => (
                  <div key={label} style={{
                    flex: 1, background: 'var(--card)', border: '1px solid var(--border)',
                    borderRadius: 8, padding: '8px 4px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 16 }}>{icon}</div>
                    <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700 }}>{count}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 9 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Images */}
        {tab === 'images' && (
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {MOCK_IMAGES.length} Photos
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
              {MOCK_IMAGES.map((img) => (
                <div key={img.id} style={{
                  aspectRatio: '1',
                  background: img.color,
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, cursor: 'pointer',
                  border: '1px solid var(--border)',
                  transition: 'transform 0.15s',
                }}>🖼️</div>
              ))}
            </div>
          </div>
        )}

        {/* Files */}
        {tab === 'files' && (
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {MOCK_FILES.length} Files
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {MOCK_FILES.map((file) => (
                <div key={file.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px',
                  background: 'var(--surface)', borderRadius: 10,
                  border: '1px solid var(--border)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  <div style={{
                    width: 36, height: 36,
                    background: 'var(--card)', borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, flexShrink: 0, border: '1px solid var(--border)',
                  }}>{file.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      color: 'var(--text)', fontSize: 12, fontWeight: 600,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{file.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 10, marginTop: 2 }}>
                      {formatFileSize(file.size)} · {file.date}
                    </div>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: 14, flexShrink: 0 }}>⬇</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
