import React from "react";

type State = { hasError: boolean; error?: Error };

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Log to console for debugging
    // eslint-disable-next-line no-console
    console.error("Uncaught error in component tree:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-xl text-center bg-card p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-sm text-muted-foreground mb-4">An unexpected error occurred. Check the console for details.</p>
            <pre className="text-xs text-left max-h-48 overflow-auto bg-background p-2 rounded">{this.state.error?.message}</pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
