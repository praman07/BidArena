import { Button } from '@/components/ui/button'

export default function DeleteConfirmDialog({
  open,
  title = 'Delete auction?',
  description = 'This action cannot be undone. The auction will be permanently removed.',
  confirmLabel = 'Delete',
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-neutral-950/40"
        aria-label="Close dialog"
        onClick={onCancel}
        disabled={isLoading}
      />
      <div className="relative w-full max-w-md rounded-xl border border-border/70 bg-white p-6 shadow-lg">
        <h2 id="delete-dialog-title" className="text-lg font-semibold tracking-tight">
          {title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-lg"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="rounded-lg"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
