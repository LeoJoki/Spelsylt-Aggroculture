import Plant from "../Plant"
import PlantGrow from "../../assets/plants/plantGrow.png"
import GrowSprite from "../../assets/plants/dogBiscuit.png"

export default class DogBiscuit extends Plant {
    constructor(game) {
        let config = {
            name : "DogBiscuit",
            rarity: "Common",
            wavesTillGrown : 1,
            width: 32,
            height : 32,
            growingSprite : PlantGrow,
            grownSprite : GrowSprite,
            description : "Slightly Higher firerate, slightly bigger bullets, takes 1 wave to grow"
        }
        super(game, config)
    }

    applyBuff() {
        if (!this.givingBuff) {
            this.player.shootCooldownMultiplier += 0.15
            this.player.projectileSize += 3.5
            this.givingBuff = true
        }
    }

    removeBuff() {
        if (this.givingBuff) {
            this.player.shootCooldownMultiplier -= 0.15
            this.player.projectileSize -= 3.5
            this.givingBuff = false
        }
    }
}