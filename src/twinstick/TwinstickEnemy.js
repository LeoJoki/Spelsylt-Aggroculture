import GameObject from "../GameObject.js"
import EnemyDeath from "../assets/sounds/EnemyDeath.mp3"
import EnemyHit from "../assets/sounds/EnemyHit.mp3"

/**
 * Abstrakt basklass för alla twinstick fiender
 * Subklasser måste definiera:
 * - color
 * - moveSpeed
 * - maxHealth
 * - shootCooldownDuration
 * - shootRange
 * - width/height
 */
export default class TwinstickEnemy extends GameObject {
    constructor(game, x, y, width, height, config = {}) {
        super(game, x - width/2, y - height/2, width, height)
        
        // Konfigurerbara properties (måste sättas av subklass eller config)

        this.color = config.color || '#FF6B6B'
        this.moveSpeed = config.moveSpeed || 0.1
        this.maxHealth = config.maxHealth || 3
        this.shootCooldownDuration = config.shootCooldownDuration || 2000
        this.shootRange = config.shootRange || 300
        this.maxshootrange =  config.projectileConfig ? config.projectileConfig.maxshootrange || 800 : 800
        this.attackSound = config.attackSound || null
        
        this.deathSFX = new Audio(EnemyDeath)
        this.deathSFX.preservesPitch = false

        this.hitSFX = new Audio(EnemyHit)
        this.hitSFX.volume = 1
        this.hitSFX.preservesPitch = false

        // Gemensamma properties
        this.velocityX = 0
        this.velocityY = 0
        this.health = this.maxHealth
        this.shootCooldown = 0
        this.state = 'idle' // idle, chase, seek, shoot
        this.lastSeenPosition = { x: x, y: y } // Senaste kända position av spelaren
        this.projectileConfig = config.projectileConfig || {target:"player"}
    }
    
    update(deltaTime) {
        const player = this.game.player
        
        // Beräkna avstånd till spelaren
        const dx = player.x - this.x
        const dy = player.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Uppdatera cooldowns
        this.updateCooldown('shootCooldown', deltaTime)
        
        // Kolla Line of Sight (använder GameObject.hasLineOfSight)
        const arenaData = this.game.arena.getData()
        const hasLOS = this.hasLineOfSight(player, arenaData.walls)
        
        // Om vi har line of sight, uppdatera last seen position
        if (hasLOS) {
            this.lastSeenPosition.x = player.x
            this.lastSeenPosition.y = player.y
        }
        
        // AI beteende baserat på avstånd och LOS
        if (hasLOS && distance < this.shootRange) {
            // Inom skjutavstånd OCH har line of sight - stanna och skjut
            this.state = 'shoot'
            this.velocityX = 0
            this.velocityY = 0
            
            // Skjut om cooldown är klar
            if (this.shootCooldown <= 0) {
                this.shoot()
                this.startCooldown('shootCooldown', this.shootCooldownDuration)
            }
        } else if (hasLOS) {
            // Har line of sight men för långt bort - jaga spelaren direkt
            this.state = 'chase'
            
            // Normalisera riktningen
            const directionX = dx / distance
            const directionY = dy / distance
            
            // Rör sig mot spelaren
            this.velocityX = directionX * this.moveSpeed
            this.velocityY = directionY * this.moveSpeed
        } else {
            // Ingen line of sight - gå mot senaste kända position
            this.state = 'seek'
            
            const seekDx = this.lastSeenPosition.x - this.x
            const seekDy = this.lastSeenPosition.y - this.y
            const seekDistance = Math.sqrt(seekDx * seekDx + seekDy * seekDy)
            
            // Om vi är nära senaste kända position, stanna och leta
            if (seekDistance < 50) {
                this.velocityX = 0
                this.velocityY = 0
            } else {
                // Rör sig mot senaste kända position
                const seekDirX = seekDx / seekDistance
                const seekDirY = seekDy / seekDistance
                this.velocityX = seekDirX * this.moveSpeed
                this.velocityY = seekDirY * this.moveSpeed
            }
        }
        
        // Uppdatera position
        this.x += this.velocityX * deltaTime
        this.y += this.velocityY * deltaTime
    }
    
    /**
     * Hanterar wall avoidance när fienden kolliderar i SEEK-läge
     * Försöker hitta en alternativ väg runt hindret
     */
    handleWallAvoidance(deltaTime) {
        const arenaData = this.game.arena.getData()
        
        // Försök röra sig perpendiculärt till blockerat håll
        // Testa flera riktningar för att hitta en väg runt
        const testAngles = [
            Math.PI / 4,   // 45 grader höger
            -Math.PI / 4,  // 45 grader vänster
            Math.PI / 2,   // 90 grader höger
            -Math.PI / 2   // 90 grader vänster
        ]
        
        // Beräkna riktning mot målet
        const dx = this.lastSeenPosition.x - this.x
        const dy = this.lastSeenPosition.y - this.y
        const baseAngle = Math.atan2(dy, dx)
        
        // Testa varje alternativ riktning
        for (const offset of testAngles) {
            const testAngle = baseAngle + offset
            const testX = this.x + Math.cos(testAngle) * this.moveSpeed * deltaTime * 50
            const testY = this.y + Math.sin(testAngle) * this.moveSpeed * deltaTime * 50
            
            // Skapa en test-position
            const testPos = {
                x: testX,
                y: testY,
                width: this.width,
                height: this.height
            }
            
            // Kolla om denna riktning är fri
            let isFree = true
            for (const wall of arenaData.walls) {
                if (testPos.x < wall.x + wall.width &&
                    testPos.x + testPos.width > wall.x &&
                    testPos.y < wall.y + wall.height &&
                    testPos.y + testPos.height > wall.y) {
                    isFree = false
                    break
                }
            }
            
            // Om riktningen är fri, använd den
            if (isFree) {
                this.velocityX = Math.cos(testAngle) * this.moveSpeed
                this.velocityY = Math.sin(testAngle) * this.moveSpeed
                break
            }
        }
    }
    
    shoot() {
        if (this.attackSound) {
            this.attackSound.currentTime = 0
            this.attackSound.playbackRate = 0.85 + Math.random() * 0.3
            this.attackSound.play()
        }
        const player = this.game.player
        
        // Beräkna riktning från fienden till spelaren
        const centerX = this.x + this.width / 2
        const centerY = this.y + this.height / 2
        const playerCenterX = player.x + player.width / 2
        const playerCenterY = player.y + player.height / 2
        
        const dx = playerCenterX - centerX
        const dy = playerCenterY - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Normalisera riktningen
        const directionX = dx / distance
        const directionY = dy / distance
        
        // Skapa fiendens projektil
        this.game.addProjectile(centerX, centerY, directionX, directionY, this.projectileConfig)
    }
    
    takeDamage(amount) {
        this.health -= amount

        this.hitSFX.currentTime = 0
        this.hitSFX.playbackRate = 0.9 + Math.random() * 0.2
        this.hitSFX.play()

        if (this.health <= 0 && !this.markedForDeletion) {
            this.deathSFX.play()
            this.markedForDeletion = true
            // Lägg till poäng när fiende dör
            this.game.score += 100
            return true
        }
    }
    
}
    

