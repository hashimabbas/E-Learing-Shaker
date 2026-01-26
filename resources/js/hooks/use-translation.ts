// resources/js/hooks/use-translation.ts
import { usePage } from '@inertiajs/react';

interface SharedProps {
    locale: string;
    t: Record<string, string>;
}

/**
 * Custom hook to provide translation utility in Inertia/React components.
 * Assumes translations are shared globally via HandleInertiaRequests.php.
 *
 * @returns {object} { t: function, locale: string }
 */
export const useTranslation = () => {
    const { locale, t: translations } = usePage().props as SharedProps;

    /**
     * Finds the translated string for a given key.
     * @param key The key of the translation string (e.g., 'dashboard').
     * @param fallback The fallback string if the key is not found.
     * @returns The translated string.
     */
    const t = (key: string, fallback?: string): string => {
        return translations[key] || fallback || key;
    };

    return { t, locale };
};
