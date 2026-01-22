import GameObject from "./GameObject";


export default class UiButton extends GameObject {
    constructor(game, x, y, width, height, color, visible = true) {
        super(game, x, y, width, height)
        this.color = color
        this.visible = visible
    }

    draw(ctx) {
        if (this.visible) {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x,this.y,this.width,this.height)
        }
    }

    activate() {
        //do something
    }
}

