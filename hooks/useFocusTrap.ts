import * as React from 'react';

export const useFocusTrap = (ref: React.RefObject<HTMLElement>, isOpen: boolean) => {
    React.useEffect(() => {
        if (!isOpen || !ref.current) return;

        const focusableElements = Array.from(
            ref.current.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
            )
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        firstElement.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Tab') {
                // if only one focusable element, do nothing
                if (focusableElements.length === 1) {
                    event.preventDefault();
                    return;
                }

                if (event.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        event.preventDefault();
                        lastElement.focus();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, ref]);
};