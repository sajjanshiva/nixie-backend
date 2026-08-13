import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./styles/index.css";

const mountEl = document.getElementById("nixie-outfit-widget");

if (mountEl) {
  ReactDOM.createRoot(mountEl).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  console.error('Nixie widget: could not find mount point <div id="nixie-outfit-widget"></div>');
}
