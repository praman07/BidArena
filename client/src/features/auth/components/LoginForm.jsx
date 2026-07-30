import { Link, useLocation, useNavigate } from 'react-router-dom'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/useToast'
import { APP_CONSTANTS } from '@/constants/appConstants'
import useAuth from '../hooks/useAuth'
import GoogleButton from './GoogleButton'
import PasswordInput from './PasswordInput'
import { loginSchema } from '../validation/auth.schema'

export default function LoginForm() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo =
    location.state?.from?.pathname || APP_CONSTANTS.DEFAULT_REDIRECT

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  const onSubmit = async ({ email, password }) => {
    try {
      const user = await login({ email, password })
      toast.success(`Welcome back, ${user.username}`)
      navigate(redirectTo, { replace: true })
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
        <CardTitle className="text-2xl tracking-tight">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account to continue bidding.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              {...register('password')}
            />
            {errors.password && (
              <p role="alert" className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* <div className="flex items-center gap-2">
            <Checkbox id="remember" {...register('remember')} />
            <Label
              htmlFor="remember"
              className="cursor-pointer font-normal text-muted-foreground"
            >
              Remember me
            </Label>
          </div> */}

          <Button type="submit" className="w-full rounded-lg" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {isSubmitting ? 'Signing in…' : 'Sign in'}
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
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
