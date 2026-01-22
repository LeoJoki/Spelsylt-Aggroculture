import Plant from "../Plant"
import PlantGrow from "../../assets/plants/plantGrow.png"
import WiltingLillyIMG from "../../assets/plants/chillies.png"

export default class Chillies extends Plant {
    constructor(game) {
        let config = {
            name : "Chillies",
            rarity: "Rare",
            wavesTillGrown : 3,
            width: 32,
            height : 32,
            growingSprite : PlantGrow,
            grownSprite : WiltingLillyIMG,
            description : "+2 damage at the cost of less firerate, takes 3 waves to grow"
        }
        super(game, config)
    }

    applyBuff() {
        if (!this.givingBuff) {
            this.player.shootCooldownMultiplier -= 0.25
            this.player.damage += 2
            this.givingBuff = true
        }
    }

    removeBuff() {
        if (this.givingBuff) {
            this.player.shootCooldownMultiplier += 0.25
            this.player.damage -= 2
            this.givingBuff = false
        }
    }
}