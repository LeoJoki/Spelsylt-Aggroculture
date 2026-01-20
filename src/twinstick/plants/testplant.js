import Plant from "../Plant";

export default class TestPlant extends Plant {
    constructor(game) {
        let config = {
            name : "UltraPlant",
            wavesTillGrown : 2,
            width: 32,
            height : 32
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