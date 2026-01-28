import GameObject from './GameObject.js'

export default class Platform extends GameObject {
    constructor(game, x, y, width, height, color = '#8B4513', spriteConfig = null) {
        super(game, x, y, width, height)
        this.color = color
        this.spriteConfig = spriteConfig

        if (this.spriteConfig) {
            this.loadSprite("idle", spriteConfig.image, spriteConfig.options)
            this.setAnimation("idle")
        }
    }

    update(deltaTime) {
        // Plattformar är statiska, gör inget
    }

    draw(ctx, camera = null) {
        if (this.spriteConfig) {
            this.drawSprite(ctx,camera)
        }
        else {
            // Beräkna screen position (om camera finns)
            const screenX = camera ? this.x - camera.x : this.x
            const screenY = camera ? this.y - camera.y : this.y
            
            // Rita plattformen
            ctx.fillStyle = this.color
            ctx.fillRect(screenX, screenY, this.width, this.height)
            
            // Rita en enkel kant/skugga för att ge djup
            ctx.strokeStyle = '#654321'
            ctx.lineWidth = 2
            ctx.strokeRect(screenX, screenY, this.width, this.height)
        }

        
    }
}
