import GameObject from "../GameObject.js"

//Detta är ett objekt för den ruta där man kan plantera ett frö så att det kan bli till en växt


export default class PlantSlot extends GameObject {
    constructor(game, x, y, width, height) {
        super(game, x, y, width, height)
        //Finns 3 states: "unplanted", "growing" och "grown"
        this.state = "unplanted"
        this.wavesTillGrown = 0
        this.plant = null
    }

    plantSeed(plant) {
        this.removePlant()

        this.plant = plant
        this.state = "growing"
        this.wavesTillGrown = plant.wavesTillGrown

        plant.x = this.x
        plant.y = this.y
    }

    onWaveComplete() {
        if (this.state == "growing" && this.plant) {
            console.log("HAS GROWN!")
            this.wavesTillGrown -= 1
            if (this.wavesTillGrown <= 0) {
                this.state = "grown"
                this.plant.applyBuff()
            }
        }
    }

    removePlant() {
        if (this.plant) {
            this.plant = null
            this.wavesTillGrown = 0
            this.state = "unplanted"
            this.plant.removeBuff()
        }
    }

    draw(ctx, camera) {
        const screenX = camera ? this.x - camera.x : this.x
        const screenY = camera ? this.y - camera.y : this.y

        ctx.fillStyle = "green"
        ctx.fillRect(screenX, screenY, this.width, this.height)
    }
}