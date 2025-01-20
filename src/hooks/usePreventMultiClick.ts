'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export const usePreventMultiClick = ({
    maxCount = 5,
    message,
}: {
    maxCount?: number;
    message?: string;
}) => {
    const [countClick, setCountClick] = useState(0);
    const canClick = countClick < maxCount;

    const handleClick = () => {
        if (countClick >= maxCount) {
            if (message) {
                toast.error(message, {
                    position: 'bottom-left',
                    id: 'prevent-multi-click',
                });
            }

            return;
        }

        setCountClick((prev) => prev + 1);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setCountClick(0);
        }, 5000);

        return () => clearTimeout(timer);
    }, [countClick]);

    return { countClick, handleClick, canClick };
};
