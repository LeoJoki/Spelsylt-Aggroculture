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
            moveSpeed: 0.08,       // Ganska långsam
            maxHealth: 10,         // Mycket hög hälsa
            shootCooldownDuration: 1000,  // Skjuter mycket ofta
            shootRange: 500        // Mycket lång räckvidd
        })
        
        this.enemyType = 'boss'
    }
}
