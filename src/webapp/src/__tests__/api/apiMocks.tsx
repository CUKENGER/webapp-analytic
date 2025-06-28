import { ReactNode, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';

export const TestFallback = ({
  error,
  reset,
  onError,
  onReset,
}: {
  error: unknown;
  reset?: () => void;
  onError?: (error: Error) => void;
  onReset?: (reset: () => void) => void;
}) => {
  console.log('TestFallback rendered with error:', error);
  if (error instanceof Error && onError) {
    onError(error);
    onError = undefined; // Предотвращаем повторные вызовы
  }
  if (reset && onReset) {
    onReset(reset);
    onReset = undefined; // Предотвращаем повторные вызовы
  }
  return null;
};

export const queryClientMock = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const queryClientMockWrapper = ({
  children,
  onError,
  onReset,
}: {
  children: ReactNode;
  onError?: (error: Error) => void;
  onReset?: (reset: () => void) => void;
}) => {
  console.log('Rendering queryClientMockWrapper');
  return (
    <QueryClientProvider client={queryClientMock}>
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary fallback={(props) => <TestFallback {...props} onError={onError} onReset={onReset} />}>
          {children}
        </ErrorBoundary>
      </Suspense>
    </QueryClientProvider>
  );
};

export const mockClient = {
  api: {
    direct: {
      ads: {
        $get: vi.fn(),
      },
      days: {
        $post: vi.fn(),
      },
      campaigns: {
        $post: vi.fn(),
      },
    },
  },
};
