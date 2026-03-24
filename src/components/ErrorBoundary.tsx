import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = 'An unexpected error occurred.';
      try {
        // Check if the error is a FirestoreErrorInfo JSON string
        const firestoreError = JSON.parse(this.state.error?.message || '');
        if (firestoreError.error && firestoreError.operationType) {
          errorMessage = `Firestore ${firestoreError.operationType} error: ${firestoreError.error}`;
        }
      } catch (e) {
        // Not a JSON error, use the raw message if available
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-md w-full bg-surface p-8 rounded-sm shadow-xl border border-error/20 text-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6 text-error">
              <AlertCircle size={32} />
            </div>
            <h2 className="font-headline text-2xl text-on-surface mb-4">Something went wrong</h2>
            <p className="text-on-surface-variant font-body mb-8 leading-relaxed">
              {errorMessage}
            </p>
            <button 
              onClick={this.handleReset}
              className="w-full silk-gradient text-on-primary py-4 rounded-sm font-label text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-lg transition-all"
            >
              <RefreshCcw size={18} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
