import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import * as Sentry from "@sentry/react";

if (import.meta.env.VITE_SENTRY_DNS) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DNS,
    environment: import.meta.env.MODE,
    sendDefaultPii: true,
  });
}

const container = document.getElementById("root")!;
const root = createRoot(container, {
  // Callback called when an error is thrown and not caught by an ErrorBoundary.
  onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
    console.warn("Uncaught error", error, errorInfo.componentStack);
  }),
  // Callback called when React catches an error in an ErrorBoundary.
  onCaughtError: Sentry.reactErrorHandler(),
  // Callback called when React automatically recovers from errors.
  onRecoverableError: Sentry.reactErrorHandler(),
});
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
