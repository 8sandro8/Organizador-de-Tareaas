import { useCallback } from 'react';

const sounds = {
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Industrial click
    success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Digital chime
    warning: 'https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3', // Alert
    kernel: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3' // High tech beep
};

export default function useSound() {
    const playSound = useCallback((type) => {
        const url = sounds[type];
        if (url) {
            const audio = new Audio(url);
            audio.volume = 0.4;
            audio.play().catch(err => console.log('Audio playback blocked/failed:', err));
        }
    }, []);

    return { playSound };
}
