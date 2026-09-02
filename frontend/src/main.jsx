import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./styles/index.css";
import cssText from "./styles/index.css?inline";

// Auto-inject CSS into page head so styles are guaranteed to load in Shopify
if (typeof document !== "undefined") {
  const styleId = "nixie-widget-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = cssText;
    document.head.appendChild(style);
  }
}

let root = null;

function mountWidget() {
  const mountEl = document.getElementById("nixie-outfit-widget");
  if (!mountEl) return false;

  if (mountEl.dataset.nixieMounted === "true" && root) return true;
  mountEl.dataset.nixieMounted = "true";

  try {
    if (!root) {
      root = ReactDOM.createRoot(mountEl);
    }
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
    console.log("[Nixie] Widget mounted successfully.");
    return true;
  } catch (err) {
    console.error("[Nixie] Error mounting widget:", err);
    return false;
  }
}

// Expose globally for direct invocation if ever needed
if (typeof window !== "undefined") {
  window.__mountNixieWidget = mountWidget;
}

// 1. Try mounting immediately
if (!mountWidget()) {
  // 2. Listen to DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountWidget);
  }

  // 3. Fallback polling for dynamically injected sections (Shopify Customizer / AJAX)
  const pollInterval = setInterval(() => {
    if (mountWidget()) {
      clearInterval(pollInterval);
    }
  }, 150);

  setTimeout(() => clearInterval(pollInterval), 8000);
}

// 4. Shopify Theme Customizer event support (re-mounting on section reload)
if (typeof document !== "undefined") {
  document.addEventListener("shopify:section:load", () => {
    const mountEl = document.getElementById("nixie-outfit-widget");
    if (mountEl) {
      delete mountEl.dataset.nixieMounted;
      root = null;
      mountWidget();
    }
  });

  document.addEventListener("shopify:section:select", () => {
    mountWidget();
  });
}

