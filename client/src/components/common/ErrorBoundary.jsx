import { Component } from 'react'
import { Button } from '@/components/ui/button'

/**
 * Catches render errors and shows a recoverable fallback.
 * Do not redesign — matches existing dashed empty-state panels.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || 'Something went wrong while rendering this page.',
    }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info?.componentStack)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' })
    if (typeof this.props.onReset === 'function') {
      this.props.onReset()
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div
        role="alert"
        className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center"
      >
        <div className="w-full rounded-2xl border border-dashed border-border bg-neutral-50/60 px-6 py-12">
          <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {this.props.fallbackMessage ||
              'An unexpected error occurred. You can try again or reload the page.'}
          </p>
          {import.meta.env.DEV && this.state.message ? (
            <p className="mt-3 break-words text-xs text-red-600">{this.state.message}</p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Button type="button" className="rounded-lg" onClick={this.handleReset}>
              Try again
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-lg"
              onClick={this.handleReload}
            >
              Reload page
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
