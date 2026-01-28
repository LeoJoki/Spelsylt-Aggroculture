import GameObject from "../GameObject.js"
import Spot from "../assets/plants/spot.png"

import Planted from "../assets/sounds/planting.mp3"
import Grown from "../assets/sounds/plantGrow.mp3"



//Detta är ett objekt för den ruta där man kan plantera ett frö så att det kan bli till en växt


export default class PlantSlot extends GameObject {
    constructor(game, x, y, width, height) {
        super(game, x, y, width, height)
        //Finns 3 states: "unplanted", "growing" och "grown"
        this.state = "unplanted"
        this.wavesTillGrown = 0
        this.plant = null
        this.plantSFX = new Audio(Planted)
        this.grownSFX = new Audio(Grown)

        //--- FORMAT FÖR ATT HÄMTA BILDER FRÅN "plants" inom "assets"
        //"../assets/plants/IMAGEFILENAME"
        const SpotOptions = {
            framesX: 1,
            framesY: 1,
            frameInterval: 100,
            frameWidth: 32,
            frameHeight: 32,
            sourceX: 0,
            sourceY: 0,
            scale: 1
        }
        this.loadSprite("unplanted",Spot, SpotOptions)
        this.setAnimation("unplanted")
    }
    draw(ctx, camera) {
        this.drawSprite(ctx, camera)
    }

    
    plantSeed(plant) {
        console.log("PLANTED!")

        const growingSptrieOptions = {
            framesX: 0,
            framesY: 0,
            frameInterval: 100,
            frameWidth: 32,
            frameHeight: 32,
            sourceX: 0,
            sourceY: 0,
            scale: 1
        }
        const grownSpriteOptions = {
            framesX: 0,
            framesY: 0,
            frameInterval: 100,
            frameWidth: 32,
            frameHeight: 32,
            sourceX: 0,
            sourceY: 0,
            scale: 1
        }

        this.loadSprite("growing",plant.growingSprite, growingSptrieOptions)
        this.loadSprite("grown",plant.grownSprite, grownSpriteOptions)

        this.setAnimation("growing")
        this.updateAnimation(0.001)

        this.plant = plant
        this.state = "growing"
        this.wavesTillGrown = plant.wavesTillGrown

        this.plantSFX.play()

        plant.x = this.x
        plant.y = this.y
    }
    removePlant() {
        if (this.plant) {

            this.setAnimation("unplanted")

            this.plant.removeBuff()
            this.plant = null
            this.wavesTillGrown = 0
            this.state = "unplanted"
        }
    }

    onWaveComplete() {
        if (this.state == "growing" && this.plant) {
            console.log("HAS GROWN!")
            this.wavesTillGrown -= 1
            if (this.wavesTillGrown <= 0) {
                this.setAnimation("grown")
                this.grownSFX.play()

                this.state = "grown"
                this.plant.applyBuff()
            }
        }
    }


}