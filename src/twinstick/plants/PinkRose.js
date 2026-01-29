import Plant from "../Plant"
import PlantGrow from "../../assets/plants/plantGrow.png"
import FullyGrown from "../../assets/plants/pinkRose.png"

export default class PinkRose extends Plant {
    constructor(game) {
        let config = {
            name : "Pink Rose",
            rarity: "Epic",
            wavesTillGrown : 3,
            width: 32,
            height : 32,
            growingSprite : PlantGrow,
            grownSprite : FullyGrown,
            description : "+2 projectiles, -1 damage, grows in 3 waves"
        }
        super(game, config)
    }

    applyBuff() {
        if (!this.givingBuff) {
            this.player.damage -= 1
            this.player.burst += 2
            this.player.spread += 10
            this.givingBuff = true
        }
    }

    removeBuff() {
        if (this.givingBuff) {
            this.player.damage += 1
            this.player.burst -= 2
            this.player.spread -= 10
            this.givingBuff = false
        }
    }
}