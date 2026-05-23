'use client';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import Link from 'next/link';
import { registerSchema } from '@/validations/auth.schema';
import { useRegister } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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

export function RegisterForm() {
  const register = useRegister();

  const form = useForm({
    defaultValues: { name: '', email: '', password: '', preferredLanguage: 'en' },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      await register.mutateAsync(value);
    },
  });

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl text-2xl mb-4 shadow-xl shadow-indigo-500/30">
          💬
        </div>
        <h1 className="text-2xl font-800 text-[var(--text)] tracking-tight">Create account</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Join AI Chat today</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
        className="flex flex-col gap-4"
      >
        <form.Field name="name" validators={{ onChange: registerSchema.shape.name }}>
          {(field) => (
            <Input
              label="Full Name"
              leftIcon="👤"
              placeholder="John Doe"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors[0]?.toString()}
            />
          )}
        </form.Field>

        <form.Field name="email" validators={{ onChange: registerSchema.shape.email }}>
          {(field) => (
            <Input
              label="Email"
              type="email"
              leftIcon="📧"
              placeholder="you@example.com"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors[0]?.toString()}
            />
          )}
        </form.Field>

        <form.Field name="password" validators={{ onChange: registerSchema.shape.password }}>
          {(field) => (
            <Input
              label="Password"
              type="password"
              leftIcon="🔒"
              placeholder="Min 8 chars, uppercase, number"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors[0]?.toString()}
            />
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
                className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-xl text-[var(--text)] text-sm px-4 py-2.5 outline-none focus:border-indigo-500/50"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
          )}
        </form.Field>

        {register.isError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            {getErrorMessage(register.error)}
          </div>
        )}

        {register.isSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-sm text-green-400">
            ✅ Account created! Check your email to verify.
          </div>
        )}

        <Button type="submit" size="lg" loading={register.isPending} className="w-full mt-1">
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--text-muted)] mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-600">
          Sign in
        </Link>
      </p>
    </div>
  );
}
