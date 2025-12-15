import TwinstickEnemy from "../TwinstickEnemy.js"

/**
 * Medium balanserad fiende
 * - Medel hälsa (3hp)
 * - Normal hastighet
 * - Standard skjutavstånd
 */
export default class MediumEnemy extends TwinstickEnemy {
    constructor(game, x, y) {
        super(game, x, y, 32, 32, {
            color: '#FFA500',      // Orange
            moveSpeed: 0.1,        // Normal hastighet
            maxHealth: 3,          // Medel hälsa
            shootCooldownDuration: 2000,
            shootRange: 300        // Normal räckvidd
        })
        
        this.enemyType = 'medium'
    }
}
