import TwinstickEnemy from "../TwinstickEnemy.js"
import biter from "../assets/enemies/biter.png"


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
            moveSpeed: 0.25,       // Snabbare än normalt
            maxHealth: 3,          // Låg hälsa
            shootCooldownDuration: 1000,
            shootRange: 45,        // Kort räckvidd
            maxshootrange: 60
        })
        this.loadSprite("biter",0,32,32)
        //fienden som slår
        this.enemyType = 'small'
    }
}
