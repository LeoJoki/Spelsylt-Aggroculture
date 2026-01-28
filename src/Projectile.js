import GameObject from './GameObject.js'

export default class Projectile extends GameObject {
    constructor(game, x, y, directionX, directionY = 0, maxDistance = 800) {
        super(game, x, y, 12, 6)
        this.directionX = directionX // -1 för vänster, 1 för höger (eller normaliserad vektor)
        this.directionY = directionY // 0 för horisontell rörelse (eller normaliserad vektor)
        this.speed = 0.5 // pixels per millisekund
        this.startX = x // Spara startposition
        this.startY = y
        this.maxDistance = maxDistance // Max en skärm långt
        this.color = 'orange'
        this.hasSprite = false
        this.spawnAcid = false
    }
    
    update(deltaTime) {
        // Flytta projektilen i 2D
        this.x += this.directionX * this.speed * deltaTime
        this.y += this.directionY * this.speed * deltaTime
        
        // Kolla om projektilen har flugit för långt (2D-distans)
        const dx = this.x - this.startX
        const dy = this.y - this.startY
        const distanceTraveled = Math.sqrt(dx * dx + dy * dy)
        if (distanceTraveled > this.maxDistance) {
            if (this.spawnAcid) {
                this.game.addAcidPuddle(this.x,this.y,60,60)
            }
            this.markedForDeletion = true
        }
    }
    
    draw(ctx, camera = null) {
        // Beräkna screen position
        const screenX = camera ? this.x - camera.x : this.x
        const screenY = camera ? this.y - camera.y : this.y
        
        // Rita projektilen som en avlång rektangel

        let rotation = Math.atan2(this.directionY,this.directionX)

        if (this.hasSprite) {
            this.drawSprite(ctx,camera, false, rotation + Math.PI/2, true)
        }
        else {
            ctx.save()

            ctx.translate(screenX + this.width/2,screenY + this.height/2)
            ctx.rotate(rotation + Math.PI/2)

            ctx.fillStyle = this.color
            ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height)

            ctx.restore()
        }
    }
}
