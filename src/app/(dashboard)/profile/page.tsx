'use client';
import { useState, useRef } from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { useRouter } from 'next/navigation';
import { updateProfileSchema } from '@/validations/auth.schema';
import { useUpdateProfile, useUploadAvatar } from '@/hooks/useUsers';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { getErrorMessage } from '@/lib/utils';

const LANGUAGES = [
  { code: 'en', label: '🇺🇸 English' },
  { code: 'bn', label: '🇧🇩 Bengali' },
  { code: 'es', label: '🇪🇸 Spanish' },
  { code: 'fr', label: '🇫🇷 French' },
  { code: 'de', label: '🇩🇪 German' },
  { code: 'ar', label: '🇸🇦 Arabic' },
  { code: 'zh', label: '🇨🇳 Chinese' },
  { code: 'ja', label: '🇯🇵 Japanese' },
  { code: 'ko', label: '🇰🇷 Korean' },
  { code: 'hi', label: '🇮🇳 Hindi' },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const fileRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      preferredLanguage: user?.preferredLanguage || 'en',
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      await updateProfile.mutateAsync(value);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadAvatar.mutate(file);
  };

  if (!user) return null;

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
    }}>
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
        <span style={{ color: 'var(--text)', fontWeight: 700, fontSize: 16 }}>Edit Profile</span>
      </div>

      <div style={{ flex: 1, padding: '32px 24px', maxWidth: 520, margin: '0 auto', width: '100%' }}>

        {/* Avatar section */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '20px 24px',
          background: 'var(--sidebar)', borderRadius: 16,
          border: '1px solid var(--border)', marginBottom: 24,
        }}>
          <div style={{ position: 'relative' }}>
            <Avatar name={user.name} src={user.avatar} size={72} radius={20} />
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                position: 'absolute', bottom: -4, right: -4,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: '2px solid var(--sidebar)',
                borderRadius: '50%', width: 26, height: 26,
                cursor: 'pointer', fontSize: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >📷</button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
          </div>
          <div>
            <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 16 }}>{user.name}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{user.email}</div>
            {uploadAvatar.isPending && (
              <div style={{ color: 'var(--accent)', fontSize: 12, marginTop: 4 }}>Uploading...</div>
            )}
          </div>
        </div>

        {/* Form */}
        <div style={{
          background: 'var(--sidebar)', borderRadius: 16,
          border: '1px solid var(--border)', padding: '24px',
        }}>
          <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="flex flex-col gap-5">

            <form.Field name="name" validators={{ onChange: updateProfileSchema.shape.name }}>
              {(field) => (
                <Input
                  label="Full Name"
                  leftIcon="👤"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors[0]?.toString()}
                />
              )}
            </form.Field>

            <form.Field name="bio">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-600 text-[var(--text-muted)] uppercase tracking-wide">Bio</label>
                  <textarea
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Tell others about yourself..."
                    rows={3}
                    style={{
                      background: 'var(--input-bg)', border: '1px solid var(--border)',
                      borderRadius: 12, color: 'var(--text)', fontSize: 14,
                      padding: '10px 14px', outline: 'none', resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                  <span style={{ color: 'var(--text-muted)', fontSize: 11, textAlign: 'right' }}>
                    {field.state.value?.length || 0}/250
                  </span>
                </div>
              )}
            </form.Field>

            <form.Field name="preferredLanguage">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-600 text-[var(--text-muted)] uppercase tracking-wide">
                    Preferred Language
                  </label>
                  <select
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    style={{
                      background: 'var(--input-bg)', border: '1px solid var(--border)',
                      borderRadius: 12, color: 'var(--text)', fontSize: 14,
                      padding: '10px 14px', outline: 'none',
                    }}
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>{l.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </form.Field>

            {updateProfile.isError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                {getErrorMessage(updateProfile.error)}
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-sm text-green-400">
                ✅ Profile updated successfully!
              </div>
            )}

            <Button type="submit" size="lg" loading={updateProfile.isPending} className="w-full">
              Save Changes
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
