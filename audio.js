class AudioManager {
    constructor() {
        this.sounds = {
            play: new Audio('sounds/brincar.mp3'),
            sleep: new Audio('sounds/dormir.wav'),
            rescue: new Audio('sounds/resgatar.wav'),
            missionComplete: new Audio('sounds/missao_completa.wav')
        };
        
        this.isMuted = localStorage.getItem('isMuted') === 'true';
        this.updateMuteState();
    }

    play(soundName) {
        if (!this.isMuted && this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(error => {
                console.warn('Erro ao tocar som:', error);
            });
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('isMuted', this.isMuted);
        this.updateMuteState();
    }

    updateMuteState() {
        const soundBtn = document.getElementById('toggleSound');
        if (soundBtn) {
            soundBtn.textContent = this.isMuted ? '🔇' : '🔊';
        }
    }
}

// Exporta a instância do AudioManager
const audioManager = new AudioManager(); 