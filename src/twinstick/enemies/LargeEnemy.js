import TwinstickEnemy from "../TwinstickEnemy.js"

/**
 * Stor långsam fiende
 * - Hög hälsa (5hp)
 * - Låg hastighet
 * - Långt skjutavstånd
 */
export default class LargeEnemy extends TwinstickEnemy {
    constructor(game, x, y) {
        super(game, x, y, 48, 48, {
            color: '#8B4513',      // Brun
            moveSpeed: 0.07,       // Långsam
            maxHealth: 5,          // Hög hälsa
            shootCooldownDuration: 1500,  // Skjuter oftare
            shootRange: 400        // Lång räckvidd
        })
        
        this.enemyType = 'large'
    }
}
