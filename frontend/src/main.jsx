import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./styles/index.css";
import cssText from "./styles/index.css?inline";

// Auto-inject Google Fonts as a real <link> tag — @import inside dynamically injected
// <style> tags is ignored by browsers, so we inject a proper <link> instead.
if (typeof document !== "undefined") {
  const fontLinkId = "nixie-google-fonts";
  if (!document.getElementById(fontLinkId)) {
    // Preconnect for faster loading
    const preconn1 = document.createElement("link");
    preconn1.rel = "preconnect";
    preconn1.href = "https://fonts.googleapis.com";
    document.head.appendChild(preconn1);

    const preconn2 = document.createElement("link");
    preconn2.rel = "preconnect";
    preconn2.href = "https://fonts.gstatic.com";
    preconn2.crossOrigin = "anonymous";
    document.head.appendChild(preconn2);

    const fontLink = document.createElement("link");
    fontLink.id = fontLinkId;
    fontLink.rel = "stylesheet";
    fontLink.href = "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Golos+Text:wght@400;500;600;700&display=swap";
    document.head.appendChild(fontLink);
  }
}

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

