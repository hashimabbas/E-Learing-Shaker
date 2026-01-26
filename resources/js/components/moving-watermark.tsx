// resources/js/components/moving-watermark.tsx (FINAL FORENSIC DRM COMPONENT)
import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

const getRandomPosition = () => ({
    // Position between 10% and 80% to keep it visible
    top: `${Math.floor(Math.random() * 70) + 10}%`,
    left: `${Math.floor(Math.random() * 70) + 10}%`,
});

export function MovingWatermark() {
    const { auth } = usePage().props as any;
    const user = auth.user;

    // The text to display (e.g., User ID and Name)
    const watermarkText = user ? `USER ID: ${user.id} | ${user.name} | IP: ${user.last_login_ip || '---'}` : 'PLATFORM PREVIEW';

    // State for the position of the watermark
    const [position, setPosition] = useState(getRandomPosition());

    // Effect to handle the movement interval
    useEffect(() => {
        const interval = setInterval(() => {
            setPosition(getRandomPosition());
        }, 8000); // Move every 8 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    if (!user) return null; // Only show for logged-in users

    return (
        <div
            style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
                // CRITICAL STYLING: Forensic DRM properties
                opacity: 0.15, // Light transparency
                color: 'white',
                zIndex: 10,
                pointerEvents: 'none', // Allows clicking on video controls underneath
                userSelect: 'none',
                transition: 'top 8s linear, left 8s linear', // Smooth transition over 8s
            }}
            className="text-sm md:text-md font-extrabold whitespace-nowrap bg-black/20 px-2 py-1 rotate-[-5deg]"
        >
            {watermarkText}
        </div>
    );
}
