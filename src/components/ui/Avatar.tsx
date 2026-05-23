'use client';
import Image from 'next/image';
import { getInitials, getAvatarGradient, STATUS_COLOR } from '@/lib/utils';
import { UserStatus } from '@/types';

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: number;
  radius?: number;
  status?: UserStatus;
  showStatus?: boolean;
}

export function Avatar({
  name,
  src,
  size = 40,
  radius = 12,
  status,
  showStatus = false,
}: AvatarProps) {
  const [c1, c2] = getAvatarGradient(name);
  const initials = getInitials(name);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {src ? (
        <Image
          src={src}
          alt={name}
          width={size}
          height={size}
          style={{ borderRadius: radius, objectFit: 'cover', width: size, height: size }}
        />
      ) : (
        <div
          style={{
            width: size,
            height: size,
            background: `linear-gradient(135deg, ${c1}, ${c2})`,
            borderRadius: radius,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size * 0.28,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: 0.5,
          }}
        >
          {initials}
        </div>
      )}

      {showStatus && status && (
        <div
          style={{
            position: 'absolute',
            bottom: -1,
            right: -1,
            width: size * 0.26,
            height: size * 0.26,
            background: STATUS_COLOR[status] || STATUS_COLOR.OFFLINE,
            borderRadius: '50%',
            border: '2px solid var(--sidebar)',
          }}
        />
      )}
    </div>
  );
}
