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
            moveSpeed: 0.2,       // Långsam
            maxHealth: 15,          // Hög hälsa
            shootCooldownDuration: 1000,
            shootRange: 45,        // Kort räckvidd
            maxshootrange: 60      // Lång räckvidd
        })
        //fienden som slår fast stor
        this.enemyType = 'large'
    }
}
