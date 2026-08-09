import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);

    // If it's a chunk loading error (code-splitting failure), auto-reload once
    if (
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Importing a module script failed')
    ) {
      const lastReload = sessionStorage.getItem('eb_last_reload');
      const now = Date.now();
      // Only auto-reload if we haven't reloaded in the last 10 seconds (prevent loop)
      if (!lastReload || now - Number(lastReload) > 10000) {
        sessionStorage.setItem('eb_last_reload', String(now));
        window.location.reload();
        return;
      }
    }
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoDashboard = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex items-center justify-center bg-docs-bg p-6 select-none">
          <div className="max-w-md w-full bg-white rounded-3xl border border-docs-border shadow-docs-card p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-extrabold text-docs-darkText">Something went wrong</h2>
              <p className="text-xs text-docs-subtext leading-relaxed">
                An unexpected error occurred. Try reloading the page or go back to your dashboard.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-docs-blue text-white rounded-xl text-xs font-bold hover:bg-docs-hoverBlue shadow-sm transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoDashboard}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 text-docs-darkText rounded-xl text-xs font-bold hover:bg-gray-200 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
