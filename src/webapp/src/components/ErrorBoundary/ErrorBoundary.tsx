import { PureComponent } from 'react'
import type { ComponentType, GetDerivedStateFromError, PropsWithChildren } from 'react'

export interface ErrorBoundaryProps extends PropsWithChildren {
  fallback: ComponentType<{ error: unknown; reset?: () => void }>
}

interface ErrorBoundaryState {
  error?: unknown
}

export class ErrorBoundary extends PureComponent<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {}

  static getDerivedStateFromError: GetDerivedStateFromError<ErrorBoundaryProps, ErrorBoundaryState> = error => {
    console.error('Error caught in ErrorBoundary:', error)
    return { error }
  }

  resetError = () => {
    this.setState({ error: undefined })
  }

  render() {
    const {
      state: { error },
      props: { fallback: Fallback, children },
    } = this
    return error ? <Fallback error={error} reset={this.resetError} /> : children
  }
}
