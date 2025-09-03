import { useEffect, useState } from 'react';

interface IUseAudio {
    playing: boolean;
    toggle: () => void;
    unlock: () => void; // 👈 thêm để mồi audio
}

const URL = '/assets/sounds/message-notification.mp3';

export default function useAudio({
    type = 'message',
}: {
    type: 'message' | 'phone-ring';
}): IUseAudio {
    const [audio, setAudio] = useState<HTMLAudioElement>();
    const [playing, setPlaying] = useState(false);

    const toggle = () => {
        console.log('useAudio.toggle');
        setPlaying(!playing);
    };

    // 👇 hàm này cần gọi 1 lần khi user click (ví dụ trong button "Bật âm thanh")
    const unlock = () => {
        if (!audio) return;
        audio.muted = true;
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
            audio.muted = false;
        });
    };

    useEffect(() => {
        switch (type) {
            case 'message':
                return setAudio(new Audio(URL));
            default:
                return setAudio(new Audio(URL));
        }
    }, [type]);

    useEffect(() => {
        if (audio) {
            if (playing) {
                audio.currentTime = 0; // đảm bảo phát từ đầu
                audio.play().catch((err) => {
                    console.warn('Play blocked:', err);
                });
            } else {
                audio.pause();
            }
        }
    }, [audio, playing]);

    useEffect(() => {
        if (!audio) return;

        const onEnd = () => setPlaying(false);
        audio.addEventListener('ended', onEnd);
        return () => {
            audio.removeEventListener('ended', onEnd);
        };
    }, [audio]);

    return { playing, toggle, unlock };
}
