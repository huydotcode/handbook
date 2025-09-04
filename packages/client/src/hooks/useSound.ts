import { soundManager } from '@/lib/soundManager';

export default function useSound(name: string) {
    return {
        play: () => soundManager.play(name),
        unlock: () => soundManager.unlockAll(),
    };
}
