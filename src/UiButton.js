import Camera from "./Camera";
import GameObject from "./GameObject";


export default class UiButton extends GameObject {
    constructor(game, x, y, width, height, color, visible = true) {
        super(game, x, y, width, height)
        this.color = color
        this.visible = visible
        this.sprite = null
        this.hoverSprite = null

        this.frameWidth = 32
        this.frameHeight = 32
    }

    draw(ctx) {
        if (this.visible) {
            const spriteOptions = {
                framesX: 1,
                framesY: 1,
                frameInterval: 1000,
                frameWidth: this.frameWidth,
                frameHeight: this.frameHeight,
                sourceX: 0,
                sourceY: 0,
                scale: 1
            }
            if (this === this.game.uiButtonHovering && this.hoverSprite) {
                this.loadSprite("hover",this.hoverSprite,spriteOptions)
                this.setAnimation("hover")
                this.drawSprite(ctx)
            }
            else if (this.sprite) {
                this.loadSprite("idle",this.sprite,spriteOptions)
                this.setAnimation("idle")
                this.drawSprite(ctx)
            }
            else {
                ctx.fillStyle = this.color
                ctx.fillRect(this.x,this.y,this.width,this.height)
            }
        }
    }

    activate() {
        //do something
    }
}

