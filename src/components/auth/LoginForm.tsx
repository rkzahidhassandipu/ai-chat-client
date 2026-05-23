'use client';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import Link from 'next/link';
import { loginSchema } from '@/validations/auth.schema';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getErrorMessage } from '@/lib/utils';

export function LoginForm() {
  const login = useLogin();

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      await login.mutateAsync(value);
    },
  });

  return (
    <div className="w-full max-w-sm">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl text-2xl mb-4 shadow-xl shadow-indigo-500/30">
          💬
        </div>
        <h1 className="text-2xl font-800 text-[var(--text)] tracking-tight">Welcome back</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Sign in to your AI Chat account</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
        className="flex flex-col gap-4"
      >
        {/* Email */}
        <form.Field
          name="email"
          validators={{ onChange: loginSchema.shape.email }}
        >
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

        {/* Password */}
        <form.Field
          name="password"
          validators={{ onChange: loginSchema.shape.password }}
        >
          {(field) => (
            <Input
              label="Password"
              type="password"
              leftIcon="🔒"
              placeholder="••••••••"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors[0]?.toString()}
            />
          )}
        </form.Field>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Error */}
        {login.isError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            {getErrorMessage(login.error)}
          </div>
        )}

        <Button type="submit" size="lg" loading={login.isPending} className="w-full mt-1">
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--text-muted)] mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-600">
          Sign up
        </Link>
      </p>
    </div>
  );
}
