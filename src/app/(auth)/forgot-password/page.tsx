'use client';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import Link from 'next/link';
import { forgotPasswordSchema } from '@/validations/auth.schema';
import { useForgotPassword } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getErrorMessage } from '@/lib/utils';

export default function ForgotPasswordPage() {
  const forgot = useForgotPassword();

  const form = useForm({
    defaultValues: { email: '' },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      await forgot.mutateAsync(value);
    },
  });

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl text-2xl mb-4 shadow-xl shadow-indigo-500/30">
          🔐
        </div>
        <h1 className="text-2xl font-800 text-[var(--text)] tracking-tight">Forgot password?</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">We'll send you a reset link</p>
      </div>

      {forgot.isSuccess ? (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-4 text-sm text-green-400 text-center">
          ✅ Reset link sent! Check your inbox.
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="flex flex-col gap-4">
          <form.Field name="email" validators={{ onChange: forgotPasswordSchema.shape.email }}>
            {(field) => (
              <Input
                label="Email Address"
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

          {forgot.isError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
              {getErrorMessage(forgot.error)}
            </div>
          )}

          <Button type="submit" size="lg" loading={forgot.isPending} className="w-full mt-1">
            Send Reset Link
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-[var(--text-muted)] mt-6">
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-600">
          ← Back to login
        </Link>
      </p>
    </div>
  );
}
