import SmallEnemy from "./enemies/SmallEnemy.js"
import MediumEnemy from "./enemies/MediumEnemy.js"
import LargeEnemy from "./enemies/LargeEnemy.js"
import BossEnemy from "./enemies/BossEnemy.js"
import AmmoPickup from "./AmmoPickup.js"

/**
 * Hanterar spawning av fiender i waves
 * Konfigureras av leveln för att definiera när och hur fiender spawnas
 */
export default class EnemySpawner {
    constructor(game, config = {}) {
        this.game = game
        
        // Spawn points (definieras av leveln)
        this.spawnPoints = config.spawnPoints || []
        
        // Wave konfiguration
        this.waves = config.waves || []
        this.currentWave = 0
        this.waveInProgress = false
        this.enemiesInWave = 0
        this.enemiesKilled = 0
        
        // Spawn timing
        this.spawnTimer = 0
        this.spawnDelay = 2000 // 2 sekunder mellan spawns
        this.waveDelay = 5000  // 5 sekunder mellan waves
        this.waveDelayTimer = 0
        
        // Wave state
        this.currentWaveEnemies = []
    }
    
    /**
     * Startar spawner systemet
     */
    start() {
        this.currentWave = 0
        this.startNextWave()
    }
    
    /**
     * Startar nästa wave
     */
    startNextWave() {
        if (this.currentWave >= this.waves.length) {
            console.log('Alla waves klara!')
            return
        }
        
        const wave = this.waves[this.currentWave]
        console.log(`Wave ${this.currentWave + 1} börjar! ${wave.enemies.length} fiender`)
        
        this.waveInProgress = true
        this.currentWaveEnemies = [...wave.enemies] // Kopiera enemy-listan
        this.enemiesInWave = wave.enemies.length
        this.enemiesKilled = 0
        this.spawnTimer = 0
    }
    
    /**
     * Spawnar en fiende på en slumpmässig spawn point
     */
    spawnEnemy(enemyType) {
        if (this.spawnPoints.length === 0) {
            console.warn('Inga spawn points definierade!')
            return null
        }
        
        // Välj en slumpmässig spawn point
        const spawnPoint = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)]
        
        // Skapa rätt typ av fiende
        let enemy = null
        switch(enemyType) {
            case 'small':
                enemy = new SmallEnemy(this.game, spawnPoint.x, spawnPoint.y)
                break
            case 'medium':
                enemy = new MediumEnemy(this.game, spawnPoint.x, spawnPoint.y)
                break
            case 'large':
                enemy = new LargeEnemy(this.game, spawnPoint.x, spawnPoint.y)
                break
            case 'boss':
                enemy = new BossEnemy(this.game, spawnPoint.x, spawnPoint.y)
                break
            default:
                console.warn(`Okänd enemy type: ${enemyType}`)
                enemy = new MediumEnemy(this.game, spawnPoint.x, spawnPoint.y)
        }
        
        return enemy
    }
    
    /**
     * Notifierar spawner när en fiende dödas
     */
    onEnemyKilled() {
        this.enemiesKilled++
        
        // Kolla om wave är klar
        if (this.enemiesKilled >= this.enemiesInWave) {
            this.onWaveComplete()
        }
    }
    
    /**
     * Kallas när en wave är klar
     */
    onWaveComplete() {
        console.log(`Wave ${this.currentWave + 1} klar!`)
        this.waveInProgress = false
        this.currentWave++
        this.waveDelayTimer = this.waveDelay
        
        // Spawna 10 ammo pickups som belöning
        this.spawnWaveReward()
        
        // Callback till game om den finns
        if (this.game.onWaveComplete) {
            this.game.onWaveComplete(this.currentWave)
        }
    }
    
    /**
     * Spawnar ammo pickups som belöning efter wave
     */
    spawnWaveReward() {
        const player = this.game.player
        const ammoCount = 10
        const centerX = player.x + player.width / 2
        const centerY = player.y + player.height / 2
        
        // Spawna ammo med "explosion" effekt
        for (let i = 0; i < ammoCount; i++) {
            const angle = (i / ammoCount) * Math.PI * 2 + Math.random() * 0.3
            const speed = 0.3 + Math.random() * 0.2 // 0.3-0.5 hastighet
            
            // Beräkna target position
            const targetRadius = 60 + Math.random() * 20
            const targetX = centerX + Math.cos(angle) * targetRadius
            const targetY = centerY + Math.sin(angle) * targetRadius
            
            // Skapa pickup med physics
            const pickup = new AmmoPickup(this.game, centerX, centerY - 30, {
                velocityX: Math.cos(angle) * speed,
                velocityY: -0.5 + Math.sin(angle) * speed * 0.5, // Flyg uppåt först
                gravity: 0.0008,
                isFlying: true,
                rotationSpeed: (Math.random() - 0.5) * 0.01 // Rotera medan de flyger
            })
            pickup.groundY = targetY
            this.game.ammoPickups.push(pickup)
        }
        
        console.log('+10 ammo reward!')
    }
    
    /**
     * Uppdaterar spawner logik
     */
    update(deltaTime) {
        // Om vi väntar mellan waves
        if (!this.waveInProgress && this.waveDelayTimer > 0) {
            this.waveDelayTimer -= deltaTime
            
            if (this.waveDelayTimer <= 0) {
                this.startNextWave()
            }
            return
        }
        
        // Om ingen wave är aktiv och vi inte väntar, starta första wave
        if (!this.waveInProgress && this.currentWave === 0) {
            this.startNextWave()
            return
        }
        
        // Spawna fiender från nuvarande wave
        if (this.waveInProgress && this.currentWaveEnemies.length > 0) {
            this.spawnTimer -= deltaTime
            
            if (this.spawnTimer <= 0) {
                // Spawna nästa fiende i listan
                const enemyType = this.currentWaveEnemies.shift()
                const enemy = this.spawnEnemy(enemyType)
                
                if (enemy) {
                    this.game.enemies.push(enemy)
                }
                
                // Återställ timer om det finns fler fiender kvar
                if (this.currentWaveEnemies.length > 0) {
                    this.spawnTimer = this.spawnDelay
                }
            }
        }
    }
    
    /**
     * Rita spawner debug info
     */
    draw(ctx, camera) {
        if (!this.game.inputHandler.debugMode) return
        
        // Rita spawn points
        this.spawnPoints.forEach(point => {
            const screenX = point.x - camera.x
            const screenY = point.y - camera.y
            
            ctx.strokeStyle = 'lime'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.arc(screenX, screenY, 20, 0, Math.PI * 2)
            ctx.stroke()
            
            ctx.fillStyle = 'lime'
            ctx.font = '12px Arial'
            ctx.fillText('SPAWN', screenX - 20, screenY - 25)
        })
        
        // Rita wave info i top center
        ctx.save()
        ctx.fillStyle = 'white'
        ctx.font = '16px Arial'
        ctx.textAlign = 'center'
        
        if (this.waveInProgress) {
            ctx.fillText(
                `Wave ${this.currentWave + 1} - ${this.enemiesKilled}/${this.enemiesInWave} killed`,
                this.game.width / 2,
                30
            )
        } else if (this.waveDelayTimer > 0) {
            ctx.fillText(
                `Next wave in ${Math.ceil(this.waveDelayTimer / 1000)}s`,
                this.game.width / 2,
                30
            )
        }
        
        ctx.restore()
    }
}
