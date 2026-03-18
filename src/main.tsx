import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { registerSW } from 'virtual:pwa-register'; // 🚀 Added PWA import
import App from "./App.tsx";
import "./index.css";

// This logic registers the Service Worker and handles automatic updates
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available for Rafiki House. Reload to update?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('Rafiki House is now available offline!');
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);