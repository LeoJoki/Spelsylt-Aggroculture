import GameObject from "../GameObject.js"
import Johnidle from "../assets/player/johnidle.png"
import Johnshoot from "../assets/player/johnshoot.png"
import Johnwalk from "../assets/player/johnwalk.png"

import Spot from "../assets/projectiles/testProjektile.png"

export default class TwinstickPlayer extends GameObject {
    constructor(game, x, y, width, height, color) {
        super(game, x, y, width, height)
        this.color = color

        // Nuvarande hastighet (pixels per millisekund)
        this.velocityX = 0
        this.velocityY = 0

        // Rörelsehastighet (hur snabbt spelaren accelererar/rör sig)
        this.moveSpeed = 0.2
        this.directionX = 0
        this.directionY = 0

        this.speedMultiplier = 0

        // ===== DESIGN: Flag-based state system =====
        // isDashing, isReloading = mutually exclusive actions
        // invulnerable = status effect (via isInvulnerable getter)
        // Timers hanteras via GameObject.updateTimer() för konsistens
        
        // Health system
        this.maxHealth = 5
        this.health = this.maxHealth
        this.invulnerableTimer = 0
        this.invulnerableDuration = 1000
        
        // Shooting system
        this.shootCooldown = 0
        this.shootCooldownDuration = 200 // Millisekunder mellan skott
        this.shootCooldownMultiplier = 0

        this.damage = 1

        this.firing = false
        this.unplanted = false

        this.spriteConfig = {
            imagePath: Spot,
            width: 8,
            height: 8
        }

        this.projectileConfig = {
            target:"enemy",
            imagePath: "../sum/sum",
            speed: 0.6,
            width: 32,
            height: 32,
            maxShootRange : 1200,
            spriteConfig : this.spriteConfig
        }
        
        // Ammo system
        /*this.maxAmmo = 8 // Skott per magasin
        this.currentAmmo = this.maxAmmo
        this.reserveAmmo = 60 // Total reserv-ammo
        this.isReloading = false
        this.reloadTimer = 0
        this.reloadDuration = 1500 // Millisekunder att ladda om*/
        
        // Dash system
        this.isDashing = false
        this.dashSpeed = 0.8 // Mycket snabbare än normal rörelse
        this.dashDuration = 150 // Millisekunder som dashen varar
        this.dashTimer = 0
        this.dashCooldown = 0
        this.dashCooldownDuration = 3000 // Millisekunder mellan dashes
        this.dashDirectionX = 0
        this.dashDirectionY = 0
        this.lastMoveDirectionX = 0 // Spara senaste rörelseriktningen
        this.lastMoveDirectionY = 0
        
        // Sprite animations - no assets loaded yet, will fallback to rectangle
        // TODO: Load sprite animations here when assets are ready
        // this.loadSprite('idle', idleSprite, frameCount, frameInterval)
        // this.loadSprite('walk', walkSprite, frameCount, frameInterval)

        const JohnidleOptions = {
            framesX: 6,
            framesY: 1,
            frameInterval: 150,
            frameWidth: 32,
            frameHeight: 32,
            sourceX: 0,
            sourceY: 0,
            scale: 1.8
        }

        this.loadSprite("idle", Johnidle, JohnidleOptions)
        this.currentAnimation = 'idle'

        const JohnwalkOptions = {
            framesX: 5,
            framesY: 1,
            frameInterval: 150,
            frameWidth: 32,
            frameHeight: 32,
            sourceX: 0,
            sourceY: 0,
            scale: 1.8
        }
        this.loadSprite("move", Johnwalk, JohnwalkOptions)
    }
    
    /**
     * Derived property: Spelaren är invulnerable under dash ELLER efter skada
     */
    get isInvulnerable() {
        return this.isDashing || this.invulnerableTimer > 0
    }

    update(deltaTime) {
        // Hantera dash med updateTimer
        if (this.isDashing) {
            if (this.updateTimer('dashTimer', deltaTime)) {
                this.isDashing = false
            }
            this.x += this.dashDirectionX * this.dashSpeed * deltaTime
            this.y += this.dashDirectionY * this.dashSpeed * deltaTime
        } else {
            let applyMult = 0

            if (this.speedMultiplier >= 0) {
                applyMult = 1 + this.speedMultiplier
            }
            else if (this.speedMultiplier < 0) {
                applyMult = 1 / (1 - this.speedMultiplier)
            }
            
            // Normal rörelse (endast när inte dashar)
            if (this.game.inputHandler.keys.has('a')) {
                this.currentAnimation = 'move'
                this.velocityX = -this.moveSpeed * applyMult
                this.directionX = -1
            } else if (this.game.inputHandler.keys.has('d')) {
                this.currentAnimation = 'move'
                this.velocityX = this.moveSpeed * applyMult
                this.directionX = 1
            } else {
                this.velocityX = 0
                this.directionX = 0
            }

            if (this.game.inputHandler.keys.has('w')) {
                this.currentAnimation = 'move'
                this.velocityY = -this.moveSpeed * applyMult
                this.directionY = -1
            } else if (this.game.inputHandler.keys.has('s')) {
                this.currentAnimation = 'move'
                this.velocityY = this.moveSpeed * applyMult
                this.directionY = 1
            } else {
                this.velocityY = 0
                this.directionY = 0
            }
            
            // Spara senaste rörelseriktningen (för dash när man står still)
            if (this.directionX !== 0 || this.directionY !== 0) {
                this.lastMoveDirectionX = this.directionX
                this.lastMoveDirectionY = this.directionY
            }

            // Uppdatera position baserat på hastighet och deltaTime
            this.x += this.velocityX * deltaTime
            this.y += this.velocityY * deltaTime
        }

        // Håll spelaren inom världens gränser
        this.x = Math.max(0, Math.min(this.x, this.game.worldWidth - this.width))
        this.y = Math.max(0, Math.min(this.y, this.game.worldHeight - this.height))
        
        // Uppdatera animation state baserat på movement
        if (this.velocityX !== 0 || this.velocityY !== 0) {
            this.setAnimation('move')
        } else {
            this.setAnimation('idle')
        }
        
        // Uppdatera animation frame
        this.updateAnimation(deltaTime)
        
        // Uppdatera alla timers med GameObject.updateTimer()
        this.updateTimer('shootCooldown', deltaTime)
        this.updateTimer('dashCooldown', deltaTime)
        this.updateTimer('invulnerableTimer', deltaTime)
        
        // Hantera reload
        /*if (this.isReloading) {
            if (this.updateTimer('reloadTimer', deltaTime)) {
                this.finishReload()
            }
        }*/
        
        // Aktivera dash med space-tangent
        if (this.game.inputHandler.keys.has(' ') && !this.isDashing && this.dashCooldown <= 0) {
            this.startDash()
        }
        
        // Starta reload med 'r'-tangent
        /*if (this.game.inputHandler.keys.has('r') && !this.isReloading && this.currentAmmo < this.maxAmmo && this.reserveAmmo > 0) {
            this.startReload()
        }*/
        
        // Auto-reload när magasinet är tomt
       /* if (this.currentAmmo === 0 && !this.isReloading && this.reserveAmmo > 0) {
            this.startReload()
        }
        */
        if (this.game.inputHandler.keys.has("t") && this.game.hoveringPlantSlot && this.unplanted == false){
            this.game.hoveringPlantSlot.removePlant()
            this.unplanted = true
        }
        else if (!this.game.inputHandler.keys.has("t")) {
            this.unplanted = false
        }

        if (!this.isDashing && this.game.inputHandler.mouseButtons.has(0) && this.shootCooldown <= 0) {
            //Planting
            if (this.game.hoveringPlantSlot && !this.firing) {
                if (this.game.hoveringPlantSlot.state == "unplanted" && this.game.seedHolding) {
                    this.game.hoveringPlantSlot.plantSeed(this.game.seedHolding)
                    this.game.seedHolding = null
                    this.game.ui.discardButton.visible = false
                }
            }
            else if (this.game.uiButtonHovering && !this.firing) {
                this.game.uiButtonHovering.activate()
            }
            else {
                //Shooting
                this.firing = true
                this.shoot()
                if (this.shootCooldownMultiplier >= 0) {
                    this.startTimer('shootCooldown', this.shootCooldownDuration / (1 + this.shootCooldownMultiplier))
                }
                else if (this.shootCooldownMultiplier < 0) {
                    this.startTimer('shootCooldown', this.shootCooldownDuration * (1 - this.shootCooldownMultiplier))
                }
            }
        }
        else if (!this.game.inputHandler.mouseButtons.has(0)) {
            this.firing = false
        }
    }
    
    startDash() {
        // Använd nuvarande rörelseriktning, eller senaste om spelaren står still
        let dashDirX = this.directionX || this.lastMoveDirectionX
        let dashDirY = this.directionY || this.lastMoveDirectionY
        
        // Om ingen riktning finns, dash framåt (default)
        if (dashDirX === 0 && dashDirY === 0) {
            dashDirX = 0
            dashDirY = 1
        }
        
        // Normalisera riktningen för diagonal dash (annars blir det snabbare diagonalt)
        const magnitude = Math.sqrt(dashDirX * dashDirX + dashDirY * dashDirY)
        this.dashDirectionX = dashDirX / magnitude
        this.dashDirectionY = dashDirY / magnitude
        
        // Aktivera dash
        this.isDashing = true
        this.startTimer('dashTimer', this.dashDuration)
        this.startTimer('dashCooldown', this.dashCooldownDuration)
        // Note: invulnerability hanteras via isInvulnerable getter (isDashing === true)
    }
    
    /*startReload() {
        this.isReloading = true
        this.startTimer('reloadTimer', this.reloadDuration)
        console.log('Reloading...')
    }
    
    finishReload() {
        // Beräkna hur många skott som behövs för att fylla magasinet
        const ammoNeeded = this.maxAmmo - this.currentAmmo
        const ammoToReload = Math.min(ammoNeeded, this.reserveAmmo)
        
        // Fyll på magasinet från reserven
        this.currentAmmo += ammoToReload
        this.reserveAmmo -= ammoToReload
        
        this.isReloading = false
        console.log(`Reload complete! Ammo: ${this.currentAmmo}/${this.maxAmmo} (Reserve: ${this.reserveAmmo})`)
    }
    
    
     //Lägger till ammo (från ammo box)
    addAmmo(amount) {
        this.reserveAmmo += amount
        console.log(`+${amount} ammo! Reserve: ${this.reserveAmmo}`)
    }*/
    
    shoot() {
        // Beräkna riktning från spelarens center till muspekarens position
        const centerX = this.x + this.width / 2
        const centerY = this.y + this.height / 2
        
        // Använd camera.screenToWorld() för att konvertera koordinater
        const mouseWorld = this.game.camera.screenToWorld(
            this.game.inputHandler.mouseX,
            this.game.inputHandler.mouseY
        )
        
        const dx = mouseWorld.x - centerX
        const dy = mouseWorld.y - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Normalisera riktningen
        const directionX = dx / distance
        const directionY = dy / distance

        // config bestämmer värden på projektilen, som target, storlek, hastighet, m.m
        
        // Skapa projektil från spelarens position
        this.game.addProjectile(centerX, centerY, directionX, directionY, this.projectileConfig)
        
        // Minska ammo
        const JohnshootOptions = {
            framesX: 3,
            framesY: 1,
            frameInterval: 1000,
            frameWidth: 32,
            frameHeight: 32,
            sourceX: 0,
            sourceY: 0,
            scale: 2
        }

        this.loadSprite("shoot", Johnshoot, JohnshootOptions)
        this.currentAnimation = 'shoot'
    }
    
    takeDamage(amount) {
        if (this.isInvulnerable) return
        
        this.health -= amount
        if (this.health < 0) this.health = 0
        
        this.startTimer('invulnerableTimer', this.invulnerableDuration)
        //console.log(`Player took ${amount} damage! Health: ${this.health}/${this.maxHealth}`)
    }

    draw(ctx, camera) {
        // Blinka när invulnerable (dash eller damage)
        if (this.isInvulnerable) {
            const blinkInterval = 100
            const timer = this.invulnerableTimer > 0 ? this.invulnerableTimer : this.dashTimer
            if (Math.floor(timer / blinkInterval) % 2 === 0) return
        }
        
        const screenX = camera ? this.x - camera.x : this.x
        const screenY = camera ? this.y - camera.y : this.y
        const spriteDrawn = this.drawSprite(ctx, camera, this.lastDirectionX === -1)
        if (!spriteDrawn) {
            // Fallback: Rita spelaren som en rektangel
            ctx.fillStyle = this.color
            ctx.fillRect(screenX, screenY, this.width, this.height)
        }
        
        // Rita debug-information om debug-läge är på
        if (this.game.inputHandler.debugMode) {
            this.drawDebug(ctx, camera)
            this.drawMouseLine(ctx, camera)
        }
    }

    // Rita linje från spelaren till muspekaren (debug)
    drawMouseLine(ctx, camera) {
        const centerX = this.x + this.width / 2
        const centerY = this.y + this.height / 2
        const screenCenterX = camera ? centerX - camera.x : centerX
        const screenCenterY = camera ? centerY - camera.y : centerY
        
        ctx.strokeStyle = 'cyan'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(screenCenterX, screenCenterY)
        ctx.lineTo(this.game.inputHandler.mouseX, this.game.inputHandler.mouseY)
        ctx.stroke()
    }
}