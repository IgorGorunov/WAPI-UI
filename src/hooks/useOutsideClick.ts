import { useEffect, RefObject } from 'react';

const useOutsideClick = <T extends HTMLElement>(
    ref: RefObject<T>,
    clickHandler: (event: MouseEvent) => void
) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                clickHandler(event);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [ref, clickHandler]);
};

export default useOutsideClick;