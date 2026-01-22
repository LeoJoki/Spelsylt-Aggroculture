import TwinstickEnemy from "../TwinstickEnemy.js"
import Biter from "../../assets/enemies/biter.png"


/**
 * Boss fiende
 * - Mycket hög hälsa (10hp)
 * - Medel hastighet
 * - Mycket långt skjutavstånd
 * - Skjuter snabbt
 */
export default class BossEnemy extends TwinstickEnemy {
    constructor(game, x, y) {
        super(game, x, y, 64, 64, {
            color: '#FF00FF',      // Magenta
            moveSpeed: 0.2,       // Ganska långsam
            maxHealth: 20,         // Mycket hög hälsa
            shootCooldownDuration: 500,  // Skjuter mycket ofta
            shootRange: 1000        // Mycket lång räckvidd
        })
        this.state = "idle"
        this.loadSprite("idle",Biter,1,0,32,32)
        this.setAnimation("idle")
        //fienden som skjuter fast stor
        this.enemyType = 'boss'
    }
}
