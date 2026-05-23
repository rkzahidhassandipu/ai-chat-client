import { formatDate } from "@/lib/utils";
import { Avatar } from "../ui/Avatar";

const ChatConvItem =({
  name, avatar, status, lastMsg, time, unread, isActive, onClick, subLabel, onMouseEnter
}: {
  id: string; name: string; avatar: string | null;
  status?: string; lastMsg: string; time: string;
  unread: number; isActive: boolean;
  onClick: () => void; subLabel?: string;
  onMouseEnter?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      style={{
        display: 'flex', alignItems: 'center', gap: 11,
        padding: '11px 16px', cursor: 'pointer',
        background: isActive ? 'var(--accent-glow)' : 'transparent',
        borderLeft: `3px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
        transition: 'all 0.15s',
      }}
    >
      <Avatar name={name} src={avatar} size={46} radius={14} status={status as any} showStatus={!!status} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: 14 }}>{name}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{time ? formatDate(time) : ''}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
          <span style={{
            color: 'var(--text-muted)', fontSize: 12,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160,
          }}>{subLabel || lastMsg}</span>
          {unread > 0 && (
            <span style={{
              background: 'var(--accent)', color: '#fff',
              borderRadius: 10, padding: '1px 7px', fontSize: 10, fontWeight: 700, flexShrink: 0,
            }}>{unread}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatConvItem