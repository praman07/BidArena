import { Users } from 'lucide-react'

export default function Participants({ count = 0 }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-sm font-semibold tracking-tight">Participants</h2>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{count}</p>
      <p className="mt-1 text-sm text-muted-foreground">Bidders in this room</p>
    </div>
  )
}
