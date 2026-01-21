import GameObject from "../GameObject.js"
import Spot from "../assets/plants/spot.png"



//Detta är ett objekt för den ruta där man kan plantera ett frö så att det kan bli till en växt


export default class PlantSlot extends GameObject {
    constructor(game, x, y, width, height) {
        super(game, x, y, width, height)
        //Finns 3 states: "unplanted", "growing" och "grown"
        this.state = "unplanted"
        this.wavesTillGrown = 0
        this.plant = null

        //--- FORMAT FÖR ATT HÄMTA BILDER FRÅN "plants" inom "assets"
        //"../assets/plants/IMAGEFILENAME"

        this.loadSprite("unplanted",Spot,1,0,32,32)
        this.setAnimation("unplanted")
    }
    draw(ctx, camera) {
        this.drawSprite(ctx, camera)
    }

    
    plantSeed(plant) {
        console.log("PLANTED!")
        this.removePlant()

        this.loadSprite("growing",plant.growingSprite,1,0,32,32)
        this.loadSprite("grown",plant.grownSprite,1,0,32,32)

        this.setAnimation("growing")

        this.plant = plant
        this.state = "growing"
        this.wavesTillGrown = plant.wavesTillGrown

        plant.x = this.x
        plant.y = this.y
    }
    removePlant() {
        if (this.plant) {

            this.setAnimation("unplanted")

            this.plant = null
            this.wavesTillGrown = 0
            this.state = "unplanted"
            this.plant.removeBuff()
        }
    }

    onWaveComplete() {
        if (this.state == "growing" && this.plant) {
            console.log("HAS GROWN!")
            this.wavesTillGrown -= 1
            if (this.wavesTillGrown <= 0) {
                this.setAnimation("grown")

                this.state = "grown"
                this.plant.applyBuff()
            }
        }
    }


}