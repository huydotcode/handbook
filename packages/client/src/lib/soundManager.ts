// soundManager.ts
class SoundManager {
    private sounds: Record<string, HTMLAudioElement> = {};

    preload(name: string, url: string) {
        const audio = new Audio(url);
        audio.preload = 'auto';
        this.sounds[name] = audio;
    }

    play(name: string) {
        const audio = this.sounds[name];
        if (!audio) return;
        audio.currentTime = 0;
        audio.play().catch((e) => console.warn('Play blocked:', e));
    }

    unlockAll() {
        Object.values(this.sounds).forEach((audio) => {
            audio.muted = true;
            audio.play().then(() => {
                audio.pause();
                audio.currentTime = 0;
                audio.muted = false;
            });
        });
    }
}

export const soundManager = new SoundManager();
