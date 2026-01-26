import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

import { usePage } from '@inertiajs/react'; // <-- IMPORT usePage
import { useEffect } from 'react';      // <-- IMPORT useEffect

// --- NEW: Echo and Pusher Initialization ---
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

import { Toaster } from "@/components/ui/sonner"

// Global setup (Vite exposes env vars via import.meta.env)
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
    // ... other configuration (host, port, forceTLS) ...
    forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
});
// ------------------------------------------

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <App {...props} />
                <Toaster />
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
