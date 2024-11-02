import { useState, useEffect } from 'react';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    const checkIsMobile = () => {
        const mobileBreakpoint = 768;
        setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    useEffect(() => {
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, []);

    return isMobile;
};

export default useIsMobile;
