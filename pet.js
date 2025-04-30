class Pet {
    constructor(name) {
        this.name = name;
        this.energy = 100;
        this.mood = 100;
        this.lastUpdate = Date.now();
        this.isSleeping = false;
        this.loadFromStorage();
    }

    loadFromStorage() {
        const savedPet = localStorage.getItem('pet');
        if (savedPet) {
            const data = JSON.parse(savedPet);
            this.name = data.name;
            this.energy = data.energy;
            this.mood = data.mood;
            this.lastUpdate = data.lastUpdate;
            this.isSleeping = data.isSleeping || false;
        }
    }

    saveToStorage() {
        localStorage.setItem('pet', JSON.stringify({
            name: this.name,
            energy: this.energy,
            mood: this.mood,
            lastUpdate: this.lastUpdate,
            isSleeping: this.isSleeping
        }));
    }

    update() {
        const now = Date.now();
        const timeDiff = (now - this.lastUpdate) / 1000; // em segundos
        
        // Diminui energia e humor com o tempo
        this.energy = Math.max(0, this.energy - (timeDiff * 0.1));
        this.mood = Math.max(0, this.mood - (timeDiff * 0.05));
        
        this.lastUpdate = now;
        this.saveToStorage();
        this.updateUI();
    }

    feed() {
        this.energy = Math.min(100, this.energy + 30);
        this.mood = Math.min(100, this.mood + 10);
        this.isSleeping = false;
        this.saveToStorage();
        this.updateUI();
        audioManager.play('feed');
    }

    play() {
        if (this.energy >= 20) {
            this.energy = Math.max(0, this.energy - 20);
            this.mood = Math.min(100, this.mood + 40);
            this.isSleeping = false;
            this.saveToStorage();
            this.updateUI();
            audioManager.play('play');
            return true;
        }
        return false;
    }

    sleep() {
        this.energy = Math.min(100, this.energy + 50);
        this.mood = Math.min(100, this.mood + 20);
        this.isSleeping = true;
        this.saveToStorage();
        this.updateUI();
        audioManager.play('sleep');

        // Acorda após 5 segundos
        setTimeout(() => {
            this.isSleeping = false;
            this.saveToStorage();
            this.updateUI();
        }, 5000);
    }

    updateUI() {
        const energyElement = document.getElementById('energy');
        const moodElement = document.getElementById('mood');
        
        if (energyElement) energyElement.textContent = Math.floor(this.energy);
        if (moodElement) moodElement.textContent = Math.floor(this.mood);
        
        // Atualiza a aparência do pet baseado no humor
        const petElement = document.getElementById('pet');
        if (petElement) {
            const hue = 120 * (this.mood / 100); // Verde (120) para feliz, Vermelho (0) para triste
            petElement.style.background = `hsl(${hue}, 100%, 50%)`;
            
            // Adiciona classe de energia baixa
            if (this.energy <= 20) {
                petElement.classList.add('low-energy');
            } else {
                petElement.classList.remove('low-energy');
            }
            
            // Atualiza o robo baseado no humor e estado
            const robotFace = petElement.querySelector('.robot-face');
            const mouth = petElement.querySelector('.mouth');
            const eyes = petElement.querySelectorAll('.eye');
            
            // Remove classes anteriores
            robotFace.classList.remove('sleeping');
            mouth.classList.remove('happy', 'sad', 'sleeping');
            eyes.forEach(eye => {
                eye.classList.remove('happy', 'sad', 'sleeping', 'tired');
            });
            
            if (this.isSleeping) {
                // Estado dormindo
                robotFace.classList.add('sleeping');
                mouth.classList.add('sleeping');
                eyes.forEach(eye => eye.classList.add('sleeping'));
            } else {
                // Estado baseado no humor
                if (this.mood >= 70) {
                    mouth.classList.add('happy');
                    eyes.forEach(eye => eye.classList.add('happy'));
                } else if (this.mood <= 30) {
                    mouth.classList.add('sad');
                    eyes.forEach(eye => eye.classList.add('sad'));
                }
                
                // Adiciona efeito de cansaço quando energia está baixa
                if (this.energy <= 30) {
                    eyes.forEach(eye => eye.classList.add('tired'));
                }
            }
            
            // Ajusta o brilho dos olhos baseado no humor
            const glowIntensity = 8 + (this.mood / 12.5);
            eyes.forEach(eye => {
                if (!this.isSleeping) {
                    eye.style.boxShadow = `0 0 ${glowIntensity}px var(--neon-primary)`;
                }
            });
        }
    }
}

// Exporta a classe Pet
window.Pet = Pet; 