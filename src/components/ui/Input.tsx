'use client';
import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-600 text-[var(--text-muted)] uppercase tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-xl text-[var(--text)] text-sm',
              'px-4 py-2.5 outline-none transition-all duration-150',
              'focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10',
              'placeholder:text-[var(--text-muted)] placeholder:opacity-50',
              leftIcon && 'pl-9',
              error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10',
              className,
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
