class MissionSystem {
    constructor() {
        this.missions = [];
        this.completedMissions = 0;
        this.loadMissions();
    }

    loadMissions() {
        const savedMissions = localStorage.getItem('missions');
        if (savedMissions) {
            const data = JSON.parse(savedMissions);
            this.missions = data.missions;
            this.completedMissions = data.completedMissions;
        } else {
            this.generateNewMissions();
        }
        this.updateUI();
    }

    saveMissions() {
        localStorage.setItem('missions', JSON.stringify({
            missions: this.missions,
            completedMissions: this.completedMissions
        }));
    }

    generateNewMissions() {
        this.missions = [
            {
                id: 1,
                type: 'feed',
                description: 'Alimente seu pet 3 vezes',
                target: 3,
                progress: 0,
                reward: 50,
                completed: false,
                rescued: false
            },
            {
                id: 2,
                type: 'play',
                description: 'Brincar com seu pet 2 vezes',
                target: 2,
                progress: 0,
                reward: 75,
                completed: false,
                rescued: false
            },
            {
                id: 3,
                type: 'sleep',
                description: 'Faça seu pet dormir 1 vez',
                target: 1,
                progress: 0,
                reward: 100,
                completed: false,
                rescued: false
            }
        ];
        this.completedMissions = 0;
        this.saveMissions();
    }

    updateMission(type) {
        const mission = this.missions.find(m => m.type === type && !m.completed);
        if (mission) {
            mission.progress++;
            if (mission.progress >= mission.target) {
                mission.completed = true;
                this.completedMissions++;
                audioManager.play('missionComplete');
            }
            this.saveMissions();
            this.updateUI();
        }
    }

    rescueMission(missionId) {
        const mission = this.missions.find(m => m.id === missionId);
        if (mission && mission.completed && !mission.rescued) {
            mission.rescued = true;
            this.saveMissions();
            this.updateUI();
            audioManager.play('rescue');
            return mission.reward;
        }
        return 0;
    }

    updateUI() {
        const missionsList = document.getElementById('missionsList');
        const completedMissionsElement = document.getElementById('completedMissions');
        
        if (missionsList) {
            missionsList.innerHTML = this.missions.map(mission => `
                <div class="mission-item">
                    <div class="mission-info">
                        <div class="mission-description">${mission.description}</div>
                        <div class="mission-progress">${mission.progress}/${mission.target}</div>
                    </div>
                    ${mission.completed && !mission.rescued ? 
                        `<button onclick="game.rescueMission(${mission.id})" class="rescue-btn">
                            Resgatar ${mission.reward} bits
                        </button>` : 
                        mission.rescued ? 
                            '<span class="rescued">Resgatado ✓</span>' : 
                            ''
                    }
                </div>
            `).join('');
        }

        if (completedMissionsElement) {
            completedMissionsElement.textContent = this.completedMissions;
        }
    }
}

// Exporta a classe MissionSystem
window.MissionSystem = MissionSystem; 