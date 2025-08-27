import { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'videoVolume';

export function useVideoVolume(defaultVolume = 1) {
    const getInitialVolume = (): number => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        const parsed = parseFloat(saved ?? '');
        return !isNaN(parsed) ? parsed : defaultVolume;
    };

    const [volume, setVolume] = useState<number>(getInitialVolume);

    // Cập nhật localStorage mỗi khi volume thay đổi
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, volume.toString());
    }, [volume]);

    return [volume, setVolume] as const;
}
