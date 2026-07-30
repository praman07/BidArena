import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/useToast'
import { APP_CONSTANTS } from '@/constants/appConstants'
import { cn } from '@/lib/utils'
import useAuth from '../hooks/useAuth'
import GoogleButton from './GoogleButton'
import PasswordInput from './PasswordInput'
import { registerSchema } from '../validation/auth.schema'

const STRENGTH_LEVELS = [
  { label: 'Weak', color: 'bg-red-500' },
  { label: 'Fair', color: 'bg-orange-400' },
  { label: 'Good', color: 'bg-yellow-400' },
  { label: 'Strong', color: 'bg-green-500' },
]

function getPasswordStrength(password) {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password) && /[^a-zA-Z0-9]/.test(password)) score += 1
  return score
}

function PasswordStrengthIndicator({ password }) {
  const strength = getPasswordStrength(password)
  if (!password) return null

  const level = STRENGTH_LEVELS[Math.max(0, strength - 1)]

  return (
    <div aria-live="polite" className="space-y-1.5">
      <div className="flex gap-1.5" aria-hidden="true">
        {STRENGTH_LEVELS.map((_, index) => (
          <span
            key={index}
            className={cn(
              'h-1 flex-1 rounded-full bg-muted transition-colors',
              index < strength && level.color
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Password strength:{' '}
        <span className="font-medium text-foreground">{level.label}</span>
      </p>
    </div>
  )
}

export default function RegisterForm() {
  const { register: registerAccount } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  })

  const password = watch('password')

  const onSubmit = async ({ username, email, password: newPassword }) => {
    try {
      const user = await registerAccount({ username, email, password: newPassword })
      toast.success(`Welcome to BidArena, ${user.username}`)
      navigate(APP_CONSTANTS.DEFAULT_REDIRECT, { replace: true })
    } catch (error) {
      error.details?.forEach(({ field, message }) => {
        setError(field, { type: 'server', message })
      })
      toast.error(error.message)
    }
  }

  return (
    <Card className="rounded-xl border-border/80">
      <CardHeader className="space-y-1.5">
        <CardTitle className="text-2xl tracking-tight">
          Create your account
        </CardTitle>
        <CardDescription>
          Join BidArena and start bidding in minutes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="yourusername"
              autoComplete="username"
              aria-invalid={!!errors.username}
              {...register('username')}
            />
            {errors.username && (
              <p role="alert" className="text-sm text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            {errors.email && (
              <p role="alert" className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register('password')}
            />
            <PasswordStrengthIndicator password={password} />
            {errors.password && (
              <p role="alert" className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p role="alert" className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full rounded-lg" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            or
          </span>
          <Separator className="flex-1" />
        </div>

        <GoogleButton disabled={isSubmitting} />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
