import Plant from "../Plant"
import PlantGrow from "../../assets/plants/plantGrow.png"
import WiltingLilly from "../../assets/plants/wiltingLilly.png"

export default class TestPlant extends Plant {
    constructor(game) {
        let config = {
            name : "Wilting Lilly",
            wavesTillGrown : 2,
            width: 32,
            height : 32,
            growingSprite : PlantGrow,
            grownSprite : WiltingLilly
        }
        super(game, config)
    }

    applyBuff() {
        if (!this.givingBuff) {
            console.log("FULLY GROWN, BUFF APPLIED!")
            this.player.shootCooldownMultiplier += 3
            this.givingBuff = true
            console.log(this.player)
        }
    }

    removeBuff() {
        if (this.givingBuff) {
            this.player.shootCoolDownMultiplier -= 3
            this.givingBuff = false
        }
    }
}