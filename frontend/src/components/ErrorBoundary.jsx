import React from "react";
import { clearSession } from "../session";

// React's default behavior on an uncaught render error is to unmount the
// ENTIRE app with no message - this is exactly what "the widget completely
// disappears" looks like from the outside. This boundary catches that and
// shows a visible, debuggable message instead of silence.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    // Bound here rather than written as a class property: for our build target
    // esbuild lowers class fields using __defProp helpers that Rollup hoists
    // ABOVE the IIFE wrapper, leaking them as globals into the Shopify page.
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Always check the browser console for this - it has the full stack trace.
    console.error("Nixie widget crashed:", error, errorInfo);
  }

  // Persisted state is the most likely thing to have poisoned the render, and
  // it outlives a refresh - so give the visitor a way out that doesn't involve
  // devtools.
  handleReset() {
    clearSession();
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-nixieCream flex flex-col items-center justify-center px-4 py-16 font-nixie text-center">
          <div className="bg-nixieCard rounded-nixie shadow-sm p-8 w-full max-w-xl">
            <h2 className="text-xl text-nixieText font-semibold mb-3">Something went wrong</h2>
            <p className="text-nixieGray text-sm mb-2">
              The outfit customizer hit an unexpected error. Start over to try again.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="bg-nixieCyan hover:bg-nixieCyanDark active:scale-[0.99] transition-all text-nixieText font-medium px-8 py-3 rounded-full mt-4"
            >
              Start Over
            </button>
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
