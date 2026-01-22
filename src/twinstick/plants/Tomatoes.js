import Plant from "../Plant"
import PlantGrow from "../../assets/plants/plantGrow.png"
import FullyGrown from "../../assets/plants/tomatoes.png"

export default class Tomatoes extends Plant {
    constructor(game) {
        let config = {
            name : "Tomatoes",
            rarity: "Common",
            wavesTillGrown : 2,
            width: 32,
            height : 32,
            growingSprite : PlantGrow,
            grownSprite : FullyGrown,
            description : "+0.5 damage, grows in 2 waves"
        }
        super(game, config)
    }

    applyBuff() {
        if (!this.givingBuff) {
            this.player.damage += 0.5
            this.givingBuff = true
        }
    }

    removeBuff() {
        if (this.givingBuff) {
            this.player.damage -= 0.5
            this.givingBuff = false
        }
    }
}