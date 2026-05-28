import { useEffect } from 'react';

export const useAmbientTheme = () => {
    useEffect(() => {
        const updateAmbientTheme = () => {
            const hour = new Date().getHours();
            const root = document.documentElement;

            // Remove existing ambient classes
            root.classList.remove('ambient-sunrise', 'ambient-midday', 'ambient-sunset', 'ambient-midnight');

            if (hour >= 6 && hour < 10) {
                // Sunrise (6am - 10am)
                root.classList.add('ambient-sunrise');
                root.style.setProperty('--ambient-glow', 'rgba(245, 158, 11, 0.15)'); // amber-500
                root.style.setProperty('--ambient-border', 'rgba(245, 158, 11, 0.3)');
                root.style.setProperty('--ambient-accent', '#f59e0b');
            } else if (hour >= 10 && hour < 16) {
                // Midday (10am - 4pm)
                root.classList.add('ambient-midday');
                root.style.setProperty('--ambient-glow', 'rgba(99, 102, 241, 0.12)'); // indigo-500
                root.style.setProperty('--ambient-border', 'rgba(99, 102, 241, 0.25)');
                root.style.setProperty('--ambient-accent', '#6366f1');
            } else if (hour >= 16 && hour < 20) {
                // Sunset (4pm - 8pm)
                root.classList.add('ambient-sunset');
                root.style.setProperty('--ambient-glow', 'rgba(244, 63, 94, 0.15)'); // rose-500
                root.style.setProperty('--ambient-border', 'rgba(244, 63, 94, 0.3)');
                root.style.setProperty('--ambient-accent', '#f43f5e');
            } else {
                // Midnight / Night (8pm - 6am)
                root.classList.add('ambient-midnight');
                root.style.setProperty('--ambient-glow', 'rgba(168, 85, 247, 0.15)'); // purple-500
                root.style.setProperty('--ambient-border', 'rgba(168, 85, 247, 0.3)');
                root.style.setProperty('--ambient-accent', '#a855f7');
            }
        };

        updateAmbientTheme();

        // Check every minute
        const intervalId = setInterval(updateAmbientTheme, 60000);

        return () => clearInterval(intervalId);
    }, []);
};
