import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useRegister } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/forms/FormField';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').min(2, 'Too short'),
  lastName: z.string().min(1, 'Last name is required').min(2, 'Too short'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const strengthColors = ['bg-destructive', 'bg-warning', 'bg-success'];
  const strengthLabels = ['Weak', 'Fair', 'Strong'];

  if (!password) return null;

  return (
    <div className="space-y-1.5 mt-1.5">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i < score ? strengthColors[score - 1] : 'bg-border'
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map((check) => (
            <span
              key={check.label}
              className={`text-xs ${check.pass ? 'text-success' : 'text-muted-foreground'}`}
            >
              {check.label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span className={`text-xs font-medium ${strengthColors[score - 1].replace('bg-', 'text-')}`}>
            {strengthLabels[score - 1]}
          </span>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: register, isPending } = useRegister();

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');

  const onSubmit = (data: RegisterFormData) => {
    register({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-display font-bold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Join thousands of learners and instructors
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="First name"
            error={errors.firstName?.message}
            htmlFor="firstName"
            required
          >
            <Input
              id="firstName"
              placeholder="Alex"
              autoComplete="given-name"
              autoFocus
              error={!!errors.firstName}
              {...registerField('firstName')}
            />
          </FormField>

          <FormField
            label="Last name"
            error={errors.lastName?.message}
            htmlFor="lastName"
            required
          >
            <Input
              id="lastName"
              placeholder="Johnson"
              autoComplete="family-name"
              error={!!errors.lastName}
              {...registerField('lastName')}
            />
          </FormField>
        </div>

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
            error={!!errors.email}
            {...registerField('email')}
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
              placeholder="Create a strong password"
              autoComplete="new-password"
              error={!!errors.password}
              className="pr-10"
              {...registerField('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <PasswordStrength password={password} />
        </FormField>

        <FormField
          label="Confirm password"
          error={errors.confirmPassword?.message}
          htmlFor="confirmPassword"
          required
        >
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="Repeat your password"
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            {...registerField('confirmPassword')}
          />
        </FormField>

        <p className="text-xs text-muted-foreground">
          By signing up, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
        </p>

        <Button type="submit" className="w-full" size="lg" loading={isPending}>
          {isPending ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
