import React from "react";

// React's default behavior on an uncaught render error is to unmount the
// ENTIRE app with no message - this is exactly what "the widget completely
// disappears" looks like from the outside. This boundary catches that and
// shows a visible, debuggable message instead of silence.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Always check the browser console for this - it has the full stack trace.
    console.error("Nixie widget crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-nixieCream flex flex-col items-center justify-center px-4 py-16 font-nixie text-center">
          <div className="bg-nixieCard rounded-nixie shadow-sm p-8 w-full max-w-xl">
            <h2 className="text-xl text-nixieText font-semibold mb-3">Something went wrong</h2>
            <p className="text-nixieGray text-sm mb-2">
              The outfit customizer hit an unexpected error. Please refresh the page and try again.
            </p>
            {this.state.error && (
              <p className="text-xs text-gray-400 mt-4 break-words">
                {String(this.state.error.message || this.state.error)}
              </p>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
