import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { type SharedData } from '@/types';

// Singleton state to share across all components using this hook
let globalCartCount: number | null = null;
let lastExpectedCount: number | null = null;
let resetTimeout: any = null;
const listeners = new Set<(count: number) => void>();

const notifyListeners = (newCount: number) => {
    listeners.forEach(listener => listener(newCount));
};

/**
 * Custom hook for optimistic cart count updates.
 * Bypasses the Inertia roundtrip delay for visual feedback.
 */
export function useCart() {
    const { props } = usePage<SharedData>();
    const serverCount = props.cart_count ?? 0;
    
    // Initialize or sync global count with server data
    if (globalCartCount === null) {
        globalCartCount = serverCount;
    }

    const [count, setCountState] = useState(globalCartCount);

    // Sync state when Inertia shared props update
    useEffect(() => {
        // Only let the server override our state if:
        // 1. We aren't waiting for a specific count (optimistic mode)
        // 2. The server has finally reached our expected count
        if (lastExpectedCount === null || serverCount === lastExpectedCount) {
            globalCartCount = serverCount;
            lastExpectedCount = null;
            if (resetTimeout) clearTimeout(resetTimeout);
            notifyListeners(serverCount);
        }
    }, [serverCount]);

    // Handle listener subscription
    useEffect(() => {
        const listener = (newCount: number) => setCountState(newCount);
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }, []);

    const updateOptimistically = (newCount: number) => {
        globalCartCount = newCount;
        lastExpectedCount = newCount;
        
        // Safety timeout: if server doesn't catch up in 5s, reset the lock
        if (resetTimeout) clearTimeout(resetTimeout);
        resetTimeout = setTimeout(() => {
            lastExpectedCount = null;
        }, 5000);

        notifyListeners(newCount);
    };

    return {
        count,
        increment: () => updateOptimistically((globalCartCount ?? 0) + 1),
        decrement: () => updateOptimistically(Math.max(0, (globalCartCount ?? 0) - 1)),
        updateOptimistically
    };
}
