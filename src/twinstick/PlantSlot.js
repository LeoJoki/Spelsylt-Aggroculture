import GameObject from "../GameObject.js"

//Detta är ett objekt för den ruta där man kan plantera ett frö så att det kan bli till en växt


export default class PlantSlot extends GameObject {
    constructor(game, x, y, width, height) {
        super(game, x, y, width, height)
        //Finns 3 states: "unplanted", "growing" och "grown"
        this.state = "unplanted"
        this.plant = null
    }

    draw(ctx, camera) {
        const screenX = camera ? this.x - camera.x : this.x
        const screenY = camera ? this.y - camera.y : this.y

        ctx.fillStyle = "green"
        ctx.fillRect(screenX, screenY, this.width, this.height)
    }
}