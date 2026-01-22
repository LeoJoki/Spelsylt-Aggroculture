import Plant from "../Plant"
import PlantGrow from "../../assets/plants/plantGrow.png"
import GrowSprite from "../../assets/plants/sunFlower.png"

export default class SunFlower extends Plant {
    constructor(game) {
        let config = {
            name : "Sunflower",
            rarity: "Common",
            wavesTillGrown : 1,
            width: 32,
            height : 32,
            growingSprite : PlantGrow,
            grownSprite : GrowSprite,
            description : "Makes you move faster, takes 1 wave to grow"
        }
        super(game, config)
    }

    applyBuff() {
        if (!this.givingBuff) {
            this.player.speedMultiplier += 0.25
            this.givingBuff = true
        }
    }

    removeBuff() {
        if (this.givingBuff) {
            this.player.speedMultiplier -= 0.25
            this.givingBuff = false
        }
    }
}