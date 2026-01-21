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
            moveSpeed: 0.15,        // Normal hastighet
            maxHealth: 3,          // Medel hälsa
            shootCooldownDuration: 900,
            shootRange: 500        // Normal räckvidd
        })
        //fienden som skjuter
        this.enemyType = 'medium'
    }
}
