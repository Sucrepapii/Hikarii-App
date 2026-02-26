import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import * as Sentry from "@sentry/react";

Sentry.init({
    dsn: "https://3eaf89653d0ac96f89da4fa27eca0e5d@o4510954431709184.ingest.de.sentry.io/4510954434854992",
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
    integrations: [
        Sentry.browserTracingIntegration()
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/hikarii\.org\/api/, /^https:\/\/checkmate-production.*\.up\.railway\.app\/api/]
});

import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "879336055295-5eqrl6964rjca5g1o7qjuc57c0roq90g.apps.googleusercontent.com"; // Fallback/Dev

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={clientId}>
            <App />
        </GoogleOAuthProvider>
    </React.StrictMode>,
)
