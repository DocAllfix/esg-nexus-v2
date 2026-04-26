import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full bg-card border border-destructive/30 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground">Si è verificato un errore</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                ESG Nexus non è riuscito a renderizzare questa pagina.
              </p>
            </div>
          </div>
          <pre className="text-xs bg-muted/40 border border-border rounded-md p-3 overflow-x-auto text-foreground/80 max-h-40">
            {String(this.state.error?.message ?? this.state.error)}
          </pre>
          <div className="flex items-center justify-end gap-2 mt-4">
            <button
              onClick={this.handleReset}
              className="px-3 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors"
            >
              Riprova
            </button>
            <button
              onClick={this.handleReload}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <RefreshCw size={14} /> Ricarica
            </button>
          </div>
        </div>
      </div>
    );
  }
}
