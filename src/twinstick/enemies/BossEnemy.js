import TwinstickEnemy from "../TwinstickEnemy.js"

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
        //fienden som skjuter fast stor
        this.enemyType = 'boss'
    }
}
