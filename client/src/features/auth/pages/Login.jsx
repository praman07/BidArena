import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useToast } from '@/components/ui/useToast'
import AuthLayout from '../components/AuthLayout'
import LoginForm from '../components/LoginForm'

const OAUTH_ERRORS = {
  google_auth_failed: 'Google sign-in was cancelled or failed. Please try again.',
}

export default function Login() {
  const [searchParams, setSearchParams] = useSearchParams()
  const toast = useToast()

  const oauthError = searchParams.get('error')

  useEffect(() => {
    if (!oauthError) return

    toast.error(OAUTH_ERRORS[oauthError] || 'Sign-in failed. Please try again.')
    setSearchParams({}, { replace: true })
  }, [oauthError, toast, setSearchParams])

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}
