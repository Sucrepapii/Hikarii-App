import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // If there's a hash (e.g. #features), try to scroll to that element
        if (hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                return;
            }
        }

        // Otherwise scroll to top
        window.scrollTo(0, 0);
    }, [pathname, hash]);

    return null;
};
