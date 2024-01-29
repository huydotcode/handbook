import { useEffect, useState } from 'react';

interface IUseAudio {
    playing: boolean;
    toggle: () => void;
}

const URL = '../assets/sounds/notification.mp3';

export default function useAudio({
    type = 'message',
}: {
    type: 'message';
}): IUseAudio {
    const [audio, setAudio] = useState<HTMLAudioElement>();
    const [playing, setPlaying] = useState(false);

    const toggle = () => setPlaying(!playing);

    useEffect(() => {
        switch (type) {
            case 'message':
                return setAudio(new Audio(URL));
            default:
                return setAudio(new Audio(URL));
        }
    }, []);

    useEffect(() => {
        if (audio) {
            playing ? audio.play() : audio.pause();
        }
    }, [playing]);

    useEffect(() => {
        if (!audio) return;

        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, []);

    return { playing, toggle };
}
