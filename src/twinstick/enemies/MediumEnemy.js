import TwinstickEnemy from "../TwinstickEnemy.js"
import Biter from "../../assets/enemies/biter.png"

/**
 * Medium balanserad fiende
 * - Medel hälsa (3hp)
 * - Normal hastighet
 * - Standard skjutavstånd
 */
export default class MediumEnemy extends TwinstickEnemy {
    constructor(game, x, y) {
        super(game, x, y, 32, 32, {
            moveSpeed: 0.15,        // Normal hastighet
            maxHealth: 3,          // Medel hälsa
            shootCooldownDuration: 900,
            shootRange: 500        // Normal räckvidd
        })
        this.loadSprite("chase",Biter,1,0,32,32)
        this.setAnimation("chase")

        //fienden som skjuter
        this.enemyType = 'medium'
    }
}
