import { useEffect } from 'react';

function useOutsideAlerter(ref: any, cb: () => void) {
    useEffect(() => {
        function handleClickOutside(event: Event) {
            if (ref.current && !ref.current.contains(event.target)) {
                cb();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, cb]);
}

export default useOutsideAlerter;
