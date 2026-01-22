import Plant from "../Plant"
import PlantGrow from "../../assets/plants/plantGrow.png"
import WiltingLillyIMG from "../../assets/plants/wiltingLilly.png"

export default class WiltingLilly extends Plant {
    constructor(game) {
        let config = {
            name : "Wilting Lilly",
            rarity: "Rare",
            wavesTillGrown : 2,
            width: 32,
            height : 32,
            growingSprite : PlantGrow,
            grownSprite : WiltingLillyIMG,
            description : "Increases Firerate greatly, takes 2 waves to grow"
        }
        super(game, config)
    }

    applyBuff() {
        if (!this.givingBuff) {
            this.player.shootCooldownMultiplier += 0.5
            this.givingBuff = true
            console.log(this.player)
        }
    }

    removeBuff() {
        if (this.givingBuff) {
            this.player.shootCooldownMultiplier -= 0.5
            this.givingBuff = false
        }
    }
}