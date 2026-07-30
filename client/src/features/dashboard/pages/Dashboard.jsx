import useAuth from '@/features/auth/hooks/useAuth'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-sm text-muted-foreground">
        Signed in as {user.username} ({user.email}) via {user.provider}.
      </p>
    </div>
  )
}
