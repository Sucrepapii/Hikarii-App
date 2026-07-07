import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "./Button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0C15] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-200 dark:border-white/10 text-center animate-scale-in">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-200 dark:border-red-800 shadow-sm">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>

            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">
              Something went wrong
            </h1>
            
            <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
              We encountered an unexpected error. Don't worry, your data is safe. Try refreshing the page or returning home.
            </p>

            <div className="flex flex-col gap-4">
              <Button 
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white rounded-2xl h-14 font-bold shadow-lg shadow-primary-600/20"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Refresh Page
              </Button>
              
              <Button 
                variant="ghost"
                onClick={this.handleReset}
                className="w-full text-slate-600 dark:text-slate-400 font-medium h-12"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <div className="mt-8 p-4 bg-slate-100 dark:bg-black/40 rounded-xl text-left overflow-auto max-h-40 text-xs font-mono text-red-500 dark:text-red-400 border border-red-500/10">
                {this.state.error.toString()}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
