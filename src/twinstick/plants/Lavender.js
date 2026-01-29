import Plant from "../Plant"
import PlantGrow from "../../assets/plants/plantGrow.png"
import FullyGrown from "../../assets/plants/lavender.png"

export default class Lavender extends Plant {
    constructor(game) {
        let config = {
            name : "Lavender",
            rarity: "Rare",
            wavesTillGrown : 2,
            width: 32,
            height : 32,
            growingSprite : PlantGrow,
            grownSprite : FullyGrown,
            description : "+1 projectiles and more spread, less firerate and bulletspeed, grows in 2 waves"
        }
        super(game, config)
    }

    applyBuff() {
        if (!this.givingBuff) {
            this.player.shootCooldownMultiplier -= 0.15
            this.player.projectileSpeed -= 0.2
            this.player.burst += 1
            this.player.spread += 10
            this.givingBuff = true
        }
    }

    removeBuff() {
        if (this.givingBuff) {
            this.player.shootCooldownMultiplier += 0.15
            this.player.projectileSpeed += 0.2
            this.player.burst -= 1
            this.player.spread -= 10
            this.givingBuff = false
        }
    }
}