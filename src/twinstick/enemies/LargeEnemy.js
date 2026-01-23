import TwinstickEnemy from "../TwinstickEnemy.js"
import Biter from "../../assets/enemies/pitcherun.png"


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
        const PitcherrunOptions = {
            framesX: 4,
            framesY: 1,
            frameInterval: 100,
            frameWidth: 32,
            frameHeight: 32,
            sourceX: 0,
            sourceY: 0,
            scale: 1.2
        }
        this.loadSprite("seek",Pitcherrun, PitcherrunOptions)
        this.setAnimation("seek")
        //fienden som slår fast stor
        this.enemyType = 'large'
    }
}
