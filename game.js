class Game {
    constructor() {
        this.bits = parseInt(localStorage.getItem('bits')) || 0;
        this.bps = parseInt(localStorage.getItem('bps')) || 0;
        this.pet = null;
        this.missionSystem = null;
        this.upgrades = {
            production: [
                { id: 1, name: 'Comida Premium', cost: 100, bps: 1, owned: 0 },
                { id: 2, name: 'Brinquedo Novo', cost: 250, bps: 2, owned: 0 },
                { id: 3, name: 'Cama Confortável', cost: 500, bps: 5, owned: 0 }
            ],
            temporary: [
                { id: 4, name: 'Bônus 2x', cost: 1000, duration: 300, active: false },
                { id: 5, name: 'Bônus 3x', cost: 2500, duration: 300, active: false }
            ],
            visual: [
                { id: 6, name: 'Cor Neon', cost: 500, owned: false },
                { id: 7, name: 'Efeito Brilhante', cost: 1000, owned: false }
            ]
        };
        this.loadUpgrades();
        this.setupEventListeners();
        this.startGameLoop();
    }

    loadUpgrades() {
        const savedUpgrades = localStorage.getItem('upgrades');
        if (savedUpgrades) {
            this.upgrades = JSON.parse(savedUpgrades);
        }
    }

    saveUpgrades() {
        localStorage.setItem('upgrades', JSON.stringify(this.upgrades));
    }

    setupEventListeners() {
        // Tela inicial
        document.getElementById('startGame').addEventListener('click', () => {
            const name = document.getElementById('petName').value.trim();
            if (name) {
                this.startGame(name);
            }
        });

        // Ações do pet
        document.getElementById('feed').addEventListener('click', () => {
            this.pet.feed();
            this.missionSystem.updateMission('feed');
        });

        document.getElementById('play').addEventListener('click', () => {
            if (this.pet.play()) {
                this.missionSystem.updateMission('play');
            }
        });

        document.getElementById('sleep').addEventListener('click', () => {
            this.pet.sleep();
            this.missionSystem.updateMission('sleep');
        });

        // Som
        document.getElementById('toggleSound').addEventListener('click', () => {
            audioManager.toggleMute();
        });
    }

    startGame(name) {
        document.querySelector('.start-screen').classList.add('hidden');
        document.querySelector('.game-hub').classList.remove('hidden');
        
        this.pet = new Pet(name);
        this.missionSystem = new MissionSystem();
        this.updateUI();
    }

    startGameLoop() {
        setInterval(() => {
            if (this.pet) {
                this.pet.update();
                this.addBits(this.bps);
                this.updateUI();
            }
        }, 1000);
    }

    addBits(amount) {
        this.bits += amount;
        localStorage.setItem('bits', this.bits);
        this.updateUI();
    }

    buyUpgrade(category, id) {
        const upgrade = this.upgrades[category].find(u => u.id === id);
        if (!upgrade) return false;

        if (this.bits >= upgrade.cost) {
            this.bits -= upgrade.cost;
            
            if (category === 'production') {
                upgrade.owned++;
                upgrade.cost = Math.floor(upgrade.cost * 1.5);
                this.bps += upgrade.bps;
            } else if (category === 'temporary') {
                upgrade.active = true;
                setTimeout(() => {
                    upgrade.active = false;
                    this.updateUI();
                }, upgrade.duration * 1000);
            } else if (category === 'visual') {
                upgrade.owned = true;
                this.applyVisualUpgrade(id);
            }

            this.saveUpgrades();
            this.updateUI();
            return true;
        }
        return false;
    }

    applyVisualUpgrade(id) {
        const pet = document.getElementById('pet');
        if (!pet) return;

        switch (id) {
            case 6: // Cor Neon
                pet.style.filter = 'hue-rotate(90deg) brightness(1.2)';
                break;
            case 7: // Efeito Brilhante
                pet.style.boxShadow = '0 0 30px var(--neon-primary)';
                break;
        }
    }

    rescueMission(missionId) {
        const reward = this.missionSystem.rescueMission(missionId);
        if (reward > 0) {
            this.addBits(reward);
        }
    }

    updateUI() {
        // Atualiza bits e BPS
        document.getElementById('bits').textContent = Math.floor(this.bits);
        document.getElementById('bps').textContent = this.bps;

        // Atualiza upgrades
        this.updateUpgradesUI();
    }

    updateUpgradesUI() {
        // Produção
        const productionUpgrades = document.getElementById('productionUpgrades');
        if (productionUpgrades) {
            productionUpgrades.innerHTML = this.upgrades.production.map(upgrade => `
                <div class="upgrade-item">
                    <div class="upgrade-info">
                        <div class="upgrade-name">${upgrade.name}</div>
                        <div class="upgrade-cost">${upgrade.cost} bits</div>
                        <div class="upgrade-owned">Owned: ${upgrade.owned}</div>
                    </div>
                    <button onclick="game.buyUpgrade('production', ${upgrade.id})" 
                            ${this.bits < upgrade.cost ? 'disabled' : ''}>
                        Comprar
                    </button>
                </div>
            `).join('');
        }

        // Temporários
        const temporaryUpgrades = document.getElementById('temporaryUpgrades');
        if (temporaryUpgrades) {
            temporaryUpgrades.innerHTML = this.upgrades.temporary.map(upgrade => `
                <div class="upgrade-item">
                    <div class="upgrade-info">
                        <div class="upgrade-name">${upgrade.name}</div>
                        <div class="upgrade-cost">${upgrade.cost} bits</div>
                        <div class="upgrade-status">${upgrade.active ? 'Ativo' : 'Inativo'}</div>
                    </div>
                    <button onclick="game.buyUpgrade('temporary', ${upgrade.id})"
                            ${this.bits < upgrade.cost || upgrade.active ? 'disabled' : ''}>
                        Ativar
                    </button>
                </div>
            `).join('');
        }

        // Visuais
        const visualUpgrades = document.getElementById('visualUpgrades');
        if (visualUpgrades) {
            visualUpgrades.innerHTML = this.upgrades.visual.map(upgrade => `
                <div class="upgrade-item">
                    <div class="upgrade-info">
                        <div class="upgrade-name">${upgrade.name}</div>
                        <div class="upgrade-cost">${upgrade.cost} bits</div>
                        <div class="upgrade-status">${upgrade.owned ? 'Comprado' : 'Não comprado'}</div>
                    </div>
                    <button onclick="game.buyUpgrade('visual', ${upgrade.id})"
                            ${this.bits < upgrade.cost || upgrade.owned ? 'disabled' : ''}>
                        Comprar
                    </button>
                </div>
            `).join('');
        }
    }
}

// Inicia o jogo quando a página carregar
window.addEventListener('load', () => {
    window.game = new Game();
}); 