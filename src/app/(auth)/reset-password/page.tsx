'use client';
import { useSearchParams } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import Link from 'next/link';
import { resetPasswordSchema } from '@/validations/auth.schema';
import { useResetPassword } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getErrorMessage } from '@/lib/utils';

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get('token') || '';
  const reset = useResetPassword();

  const form = useForm({
    defaultValues: { token, newPassword: '', confirmPassword: '' },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      await reset.mutateAsync(value);
    },
  });

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-400 text-sm">Invalid reset link.</p>
        <Link href="/forgot-password" className="text-indigo-400 text-sm mt-2 inline-block">
          Request a new one →
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl text-2xl mb-4 shadow-xl shadow-indigo-500/30">
          🔑
        </div>
        <h1 className="text-2xl font-800 text-[var(--text)] tracking-tight">Set new password</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Choose a strong password</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="flex flex-col gap-4">
        <form.Field name="newPassword">
          {(field) => (
            <Input
              label="New Password"
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

        <form.Field name="confirmPassword">
          {(field) => (
            <Input
              label="Confirm Password"
              type="password"
              leftIcon="🔒"
              placeholder="Repeat your password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors[0]?.toString()}
            />
          )}
        </form.Field>

        {reset.isError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            {getErrorMessage(reset.error)}
          </div>
        )}

        <Button type="submit" size="lg" loading={reset.isPending} className="w-full mt-1">
          Reset Password
        </Button>
      </form>
    </div>
  );
}
