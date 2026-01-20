import TwinstickEnemy from "../TwinstickEnemy.js"

/**
 * Liten snabb fiende
 * - Låg hälsa (2hp)
 * - Hög hastighet
 * - Kort skjutavstånd
 */
export default class SmallEnemy extends TwinstickEnemy {
    constructor(game, x, y) {
        super(game, x, y, 32, 32, {
            color: '#FF6B6B',      // Röd
            moveSpeed: 0.15,       // Snabbare än normalt
            maxHealth: 2,          // Låg hälsa
            shootCooldownDuration: 2500,
            shootRange: 250        // Kort räckvidd
        })
        
        this.enemyType = 'small'
    }
}
