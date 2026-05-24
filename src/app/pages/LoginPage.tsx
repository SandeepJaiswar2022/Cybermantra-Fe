import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useLogin } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/forms/FormField';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-display font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to continue your learning journey
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          label="Email"
          error={errors.email?.message}
          htmlFor="email"
          required
        >
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
            error={!!errors.email}
            {...register('email')}
          />
        </FormField>

        <FormField
          label="Password"
          error={errors.password?.message}
          htmlFor="password"
          required
        >
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              error={!!errors.password}
              className="pr-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </FormField>

        <div className="flex items-center justify-end">
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isPending}>
          {isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link
          to={ROUTES.REGISTER}
          className="font-medium text-primary hover:underline"
        >
          Sign up for free
        </Link>
      </p>
    </div>
  );
}
