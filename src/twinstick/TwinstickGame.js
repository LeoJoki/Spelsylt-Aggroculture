import GameBase from "../GameBase.js"
import TwinstickPlayer from "./TwinstickPlayer.js"
import Projectile from "../Projectile.js"
import TwinstickArena from "./TwinstickArena.js"
import EnemySpawner from "./EnemySpawner.js"
import PlantSlot from "./PlantSlot.js"
import SeedPicker from "./plants/SeedPicker.js"
import MainMenu from "../menus/MainMenu.js"
import UiButton from "../UiButton.js"

export default class TwinstickGame extends GameBase {
    constructor(canvas) {
        super(canvas)

        // Justera world size för top-down spel
        this.worldWidth = canvas.width * 1.5
        this.worldHeight = canvas.height * 1.5
        this.camera.setWorldBounds(this.worldWidth, this.worldHeight)

        // Specifika egenskaper för TwinstickGame
        this.player = null
        this.npcs = []
        this.items = []
        this.projectiles = []
        this.enemyProjectiles = []
        this.arena = null
        this.spawner = null

        this.uiButtonHovering = null
        this.plantSlots = []
        this.seedHolding = null
        this.seedPicker = new SeedPicker(this)
        this.hoveringPlantSlot = null

        this.init()

        this.currentMenu = new MainMenu(this)
    }

    init() {
        // Skapa arena
        this.arena = new TwinstickArena(this)
        const arenaData = this.arena.getData()
        
        // Initiera spelobjekt som spelare, NPCs, items etc
        this.player = new TwinstickPlayer(
            this,
            arenaData.playerSpawnX,
            arenaData.playerSpawnY,
            48,
            48,
            'purple'
        )

        //Skapar en Array för alla plantslots
        //Ser till att spelet alltid vet om vilka plantSlots som finns som gör att 
        //alla andra gameObjekt klasser också känner till alla plantSlots och deras state
        const fieldX = arenaData.field.x
        const fieldY = arenaData.field.y

        for (let stepX = 0; stepX < 3; stepX++) {
            for (let stepY = 0; stepY < 3; stepY++) {
                let plantSlot = new PlantSlot(this,fieldX + stepX*64,fieldY + stepY*64,64,64)
                this.plantSlots.push(plantSlot)
            }
        }
        
        // Återställ camera
        this.camera.x = 0
        this.camera.y = 0
        this.camera.targetX = 0
        this.camera.targetY = 0
        
        // Skapa enemy spawner med arena's wave config
        this.spawner = new EnemySpawner(this, arenaData.waveConfig)
        this.spawner.start()
    }
    
    restart() {
        // Återställ spelet till initial state
    }

    /*
    spriteConfig = {
        imagePath: "../sum/sum"
        width: 16
        height: 16
    }
    
    config = {
        target: "player" or "enemy",
        speed: 0.6,
        width: 12,
        height: 12,
        maxShootRange: 800,
        spriteConfig : spriteConfig
    }
    */

    addProjectile(x, y, directionX, directionY, config = {}) {
        // Skapa en ny projektil med Projectile-klassen
        const projectile = new Projectile(this, x, y, directionX, directionY)
        projectile.speed = config.speed ? config.speed : 0.6 // Twinstick är snabbare än platformer
        projectile.width = config.width ? config.width : 8
        projectile.height = config.height ? config.height : 8

        if (config.spriteConfig) {
            projectile.hasSprite = true
            projectile.loadSprite("projectile",config.spriteConfig.imagePath,1,0,config.spriteConfig.width,config.spriteConfig.height)
            projectile.setAnimation("projectile")
            projectile.updateAnimation(0.01)
        }

        if (config.target == "enemy") {
            projectile.color = 'yellow'
            this.projectiles.push(projectile)
        }
        else if (config.target == "player") {
            projectile.color = 'red'
            this.enemyProjectiles.push(projectile)
        }
        
    }
    
    /*
    addEnemyProjectile(x, y, directionX, directionY, maxshootrange) {
        // Skapa fiendens projektil
        const projectile = new Projectile(this, x, y, directionX, directionY, maxshootrange)
        projectile.speed = 0.3 // Mycket långsammare än spelarens projektiler
        projectile.color = 'red'
        projectile.width = 8
        projectile.height = 8
        this.enemyProjectiles.push(projectile)
    }
    */
    update(deltaTime) {
        // Uppdatera spel-logik varje frame
        const playerPrevX = this.player.x
        const playerPrevY = this.player.y

        if (this.gameState === 'MENU' && this.currentMenu) {
            this.currentMenu.update(deltaTime)
            this.inputHandler.keys.clear() // Rensa keys så de inte läcker till spelet
            return
        }
                
            // Kolla Escape för att öppna menyn under spel
        if (this.inputHandler.keys.has('Escape') && this.gameState === 'PLAYING') {
            this.gameState = 'MENU'
            this.currentMenu = new MainMenu(this)
            return
        }
        
        // Uppdatera spawner
        if (this.spawner) {
            this.spawner.update(deltaTime)
        }
        
        this.player.update(deltaTime)
        
        // Kolla kollision mellan spelare och väggar
        // Axis-separated collision - testa varje axel oberoende
        const arenaData = this.arena.getData()
        
        // Spara nya positionen efter update
        const playerNewX = this.player.x
        const playerNewY = this.player.y
        
        // Testa X-axeln: Använd nya X men gamla Y
        this.player.y = playerPrevY
        let hasXCollision = false
        for (const wall of arenaData.walls) {
            if (this.player.intersects(wall)) {
                hasXCollision = true
                break
            }
        }
        if (hasXCollision) {
            this.player.x = playerPrevX
        }
        
        // Testa Y-axeln: Använd nuvarande X (antingen ny eller återställd) och nya Y
        this.player.y = playerNewY
        let hasYCollision = false
        for (const wall of arenaData.walls) {
            if (this.player.intersects(wall)) {
                hasYCollision = true
                break
            }
        }
        if (hasYCollision) {
            this.player.y = playerPrevY
        }
        
        // Uppdatera alla projektiler
        this.projectiles.forEach(projectile => {
            projectile.update(deltaTime)
            
            // Kolla kollision mellan projektiler och väggar
            arenaData.walls.forEach(wall => {
                if (projectile.intersects(wall)) {
                    projectile.markedForDeletion = true
                }
            })
        })
        
        // Ta bort markerade projektiler
        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion)
        
        // Uppdatera fiender
        this.enemies.forEach(enemy => {
            const enemyPrevX = enemy.x
            const enemyPrevY = enemy.y
            
            enemy.update(deltaTime)
            
            // Kolla kollision mellan fiender och väggar
            let hasCollision = false
            arenaData.walls.forEach(wall => {
                const collision = enemy.getCollisionData(wall)
                if (collision) {
                    hasCollision = true
                    if (collision.direction === 'left' || collision.direction === 'right') {
                        enemy.x = enemyPrevX
                    }
                    if (collision.direction === 'top' || collision.direction === 'bottom') {
                        enemy.y = enemyPrevY
                    }
                }
            })
            
            // Om fienden kolliderar under SEEK-läge, försök hitta en väg runt
            if (hasCollision && enemy.state === 'seek') {
                enemy.handleWallAvoidance(deltaTime)
            }
        })
        
        // Uppdatera fiendens projektiler
        this.enemyProjectiles.forEach(projectile => {
            projectile.update(deltaTime)
            
            // Kolla kollision med väggar
            arenaData.walls.forEach(wall => {
                if (projectile.intersects(wall)) {
                    projectile.markedForDeletion = true
                }
            })

            if (projectile.intersects(this.player)){
                if (!this.player.isInvulnerable) {
                    this.player.takeDamage(1)
                }
                projectile.markedForDeletion = true
            }
        })
        
        // Kolla kollision mellan spelarens projektiler och fiender
        this.projectiles.forEach(projectile => {
            this.enemies.forEach(enemy => {
                if (projectile.intersects(enemy)) {
                    let dead = enemy.takeDamage(this.player.damage)
                    projectile.markedForDeletion = true

                    if (dead) {
                        // Notifiera spawner om fiende dödas
                        if (this.spawner) {
                            this.spawner.onEnemyKilled()
                        }
                        
                        // Spawna ammo pickups baserat på fiendens health med flying effekt
                        /*const ammoCount = enemy.maxHealth
                        const centerX = enemy.x + enemy.width / 2
                        const centerY = enemy.y + enemy.height / 2
                        
                        for (let i = 0; i < ammoCount; i++) {
                            const angle = Math.random() * Math.PI * 2
                            const speed = 0.2 + Math.random() * 0.15
                            const targetRadius = 15 + Math.random() * 20
                            
                            const pickup = new AmmoPickup(this, centerX, centerY - 20, {
                                velocityX: Math.cos(angle) * speed,
                                velocityY: -0.3 + Math.sin(angle) * speed * 0.3,
                                gravity: 0.0008,
                                isFlying: true,
                                rotationSpeed: (Math.random() - 0.5) * 0.008
                            })
                            pickup.groundY = centerY + Math.sin(angle) * targetRadius
                            this.ammoPickups.push(pickup)
                        }*/
                    }
                }
            })
        })
        
        // Ta bort markerade fiendens projektiler
        this.enemyProjectiles = this.enemyProjectiles.filter(p => !p.markedForDeletion)
        
        // Ta bort döda fiender
        this.enemies = this.enemies.filter(e => !e.markedForDeletion)
        
        // Kolla om musen ligger över en plantslot
        let hoveringUI = false
        let hoveringPlant = false

        //Kolla om musen ligger över en ui knapp
        this.ui.uiButtons.forEach(button => {
            const other = {
                x : this.inputHandler.mouseX,
                y : this.inputHandler.mouseY,
                width : 0,
                height : 0
            }

            if (button.intersectsMouse(other) && button.visible) {
                hoveringUI = true
                if (button != this.uiButtonHovering) {
                    this.uiButtonHovering = button
                }
            }
        })
        if (!hoveringUI) {
            this.plantSlots.forEach(plantSlot =>{
                const other = {
                    x : this.inputHandler.mouseX,
                    y : this.inputHandler.mouseY,
                    width : 0,
                    height : 0
                }

                if (plantSlot.intersectsMouse(other, this.camera)) {
                    hoveringPlant = true
                    if (plantSlot != this.hoveringPlantSlot) {
                        this.hoveringPlantSlot = plantSlot
                    }
                }
            })
        }

        if (!hoveringUI && this.uiButtonHovering) {
            this.uiButtonHovering = null
        }

        if (!hoveringPlant && this.hoveringPlantSlot) {
            this.hoveringPlantSlot = null
        }
        // Kolla kollision mellan spelare och ammo pickups
       /* this.ammoPickups.forEach(pickup => {
            const pickupPrevX = pickup.x
            const pickupPrevY = pickup.y
            
            // Uppdatera pickup physics
            pickup.update(deltaTime)
            
            // Kolla kollision med väggar om pickupen flyger
            if (pickup.isFlying) {
                arenaData.walls.forEach(wall => {
                    const collision = pickup.getCollisionData(wall)
                    if (collision) {
                        // Reflektera velocity baserat på kollisionsriktning
                        if (collision.direction === 'left' || collision.direction === 'right') {
                            pickup.x = pickupPrevX
                            pickup.velocityX = -pickup.velocityX * 0.6 // Reflektera och dämpa
                        }
                        if (collision.direction === 'top' || collision.direction === 'bottom') {
                            pickup.y = pickupPrevY
                            pickup.velocityY = -pickup.velocityY * 0.6 // Reflektera och dämpa
                        }
                    }
                })
            }
            
            // Kolla kollision med spelare (kan plocka upp även när de flyger)
            if (this.player.intersects(pickup)) {
                this.player.addAmmo(pickup.ammoValue)
                pickup.markedForDeletion = true
            }
        })
        
        // Ta bort uppplockade ammo pickups
        this.ammoPickups = this.ammoPickups.filter(p => !p.markedForDeletion)*/

        this.camera.follow(this.player)
        this.camera.update(deltaTime)
    }

    draw(ctx) {
        // Rita debug-grid om debug-läge är på
        if (this.inputHandler.debugMode) {
            this.drawDebugGrid(ctx)
        }
        
        // Rita arena (golv och väggar)
        this.arena.draw(ctx, this.camera)

        //ritar alla plantor
        this.plantSlots.forEach(plantSlot => {
            plantSlot.draw(ctx, this.camera)
        })
        
        // Rita spelvärlden och objekt
        this.player.draw(ctx, this.camera)
        
        // Rita fiender
        this.enemies.forEach(enemy => {
            enemy.draw(ctx, this.camera)
        })
        
        // Rita alla projektiler
        this.projectiles.forEach(projectile => {
            projectile.draw(ctx, this.camera)
        })
        
        // Rita fiendens projektiler
        this.enemyProjectiles.forEach(projectile => {
            projectile.draw(ctx, this.camera)
        })


        
        // Rita spawner (debug info)
        if (this.spawner) {
            this.spawner.draw(ctx, this.camera)
        }
        
        // Rita UI (health, ammo, score)
        this.ui.draw(ctx)
    }
    
    // Rita ett 32x32 grid i världen
    drawDebugGrid(ctx) {
        const gridSize = 32
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
        ctx.lineWidth = 1
        
        // Beräkna vilka grid-linjer som är synliga på skärmen
        const startX = Math.floor(this.camera.x / gridSize) * gridSize
        const startY = Math.floor(this.camera.y / gridSize) * gridSize
        const endX = this.camera.x + this.width
        const endY = this.camera.y + this.height
        
        // Rita vertikala linjer
        for (let x = startX; x <= endX; x += gridSize) {
            const screenX = x - this.camera.x
            ctx.beginPath()
            ctx.moveTo(screenX, 0)
            ctx.lineTo(screenX, this.height)
            ctx.stroke()
        }
        
        // Rita horisontella linjer
        for (let y = startY; y <= endY; y += gridSize) {
            const screenY = y - this.camera.y
            ctx.beginPath()
            ctx.moveTo(0, screenY)
            ctx.lineTo(this.width, screenY)
            ctx.stroke()
        }
    }

    onWaveComplete(currentWave) {
        this.plantSlots.forEach(plantSlot => {
            plantSlot.onWaveComplete()
        })
        if (!this.seedHolding) {
            this.seedHolding = this.seedPicker.getRandomSeed()
        }
    }
}