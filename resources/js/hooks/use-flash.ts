import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export function useFlash() {
    const { flash } = usePage().props; // Inertia automatically provides flash data
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (flash.message) {
            setMessage(flash.message);
        }
        if (flash.error) {
            setError(flash.error);
        }
        if (flash.success) {
            setSuccess(flash.success);
        }

        // Optional: You can auto-hide the message after a few seconds
        const timer = setTimeout(() => {
            setMessage(null);
            setError(null);
            setSuccess(null);
        }, 5000); // Clear messages after 5 seconds

        return () => clearTimeout(timer); // Clean up timer on unmount
    }, [flash]); // Dependency array ensures that it runs when flash messages change

    return { message, error, success };
}
