import TwinstickEnemy from "../TwinstickEnemy.js"
import Gunflowerrun from "../../assets/enemies/gunflowerrun.png"

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

        const GunflowerrunOptions = {
            framesX: 4,
            framesY: 1,
            frameInterval: 100,
            frameWidth: 32,
            frameHeight: 32,
            sourceX: 0,
            sourceY: 32,
            scale: 1.4
        }
        this.loadSprite("seek",Gunflowerrun, GunflowerrunOptions)
        this.setAnimation("seek")
        //fienden som slårdsaduiadbauo
        this.enemyType = 'small'
        
    }

    update(deltaTime){
        super.update(deltaTime)
        this.updateAnimation(deltaTime)
    }

    draw(ctx, camera) {
        this.drawSprite(ctx, camera)
    }
}
