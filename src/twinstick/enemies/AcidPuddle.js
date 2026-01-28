import GameObject from "../../GameObject"
import AcidBlob from "../../assets/projectiles/acidBlob.png"


export default class AcidPuddle extends GameObject {
    constructor(game,x,y,target_width,target_height) {
        super(game, x, y, 0, 0)

        this.actual_x = x
        this.actual_y = y
        this.target_height = target_height
        this.target_width = target_width

        this.startTimer("appear",500)
        this.startTimer("exist", 3000)

        this.active = true
        this.canHurt = true

        const puddleOptions = {
            framesX: 0,
            framesY: 0,
            frameInterval: 150,
            frameWidth: 4,
            frameHeight: 4,
            sourceX: 0,
            sourceY: 0,
            scale: 1
        }

        this.loadSprite("idle",AcidBlob,puddleOptions)
        this.setAnimation("idle")

    }

    draw(ctx, camera) {
        const screenX = camera ? this.x - camera.x : this.x
        const screenY = camera ? this.y - camera.y : this.y

        //ctx.fillRect(screenX,screenY,this.width,this.height)
        this.drawSprite(ctx,camera)
    }

    hurtPlayer(player) {
        player.takeDamage(1)
        this.canHurt = false
        this.startTimer("hurtDelay",500)
    }

    update(deltaTime) {
        if (this["appear"] > 0) {
            this.updateTimer("appear",deltaTime)

            let multiplier = (500-this["appear"])/500

            this.width = this.target_width * multiplier
            this.height = this.target_height * multiplier
            this.x = this.actual_x - this.width/2
            this.y = this.actual_y - this.height/2
        }
        if (this["dissappear"]) {
            if (this["dissappear"] > 0) {
                this.updateTimer("dissappear",deltaTime)

                this.width = this.target_width * (this["dissappear"]/500)
                this.height = this.target_height * (this["dissappear"]/500)
                this.x = this.actual_x - this.width/2
                this.y = this.actual_y - this.height/2

            }
            else {
                this.markedForDeletion = true
            }
        }
        if (this["hurtDelay"]) {
            if (this["hurtDelay"] > 0) {
                this.updateTimer("hurtDelay", deltaTime)
            }
            else {
                this.canHurt = true
            }
        }
        
        if (this["exist"] > 0) {
            this.updateTimer("exist", deltaTime)
        }
        else {
            if (this.active) {
                this.active = false
                this.startTimer("dissappear",500)
            }
        }
    }
}