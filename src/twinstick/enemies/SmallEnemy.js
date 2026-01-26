import TwinstickEnemy from "../TwinstickEnemy.js"
import Biter from "../../assets/enemies/biter.png"
import Biterrun from "../../assets/enemies/biterrun.png"
import Biterbiting from "../../assets/enemies/biterbiting.png"

/**
 * Liten snabb fiende
 * - Låg hälsa (2hp)
 * - Hög hastighet
 * - Kort skjutavstånd
 */
export default class SmallEnemy extends TwinstickEnemy {
    constructor(game, x, y) {
        let spriteConfig = {
            imagePath: "../sum/sum",
            width: 16,
            height: 16
        }
        
        let projectileConfig = {
            target: "player",
            speed: 1,
            width: 12,
            height: 12,
            maxShootRange: 50,
        }


        super(game, x, y, 32, 32, {
            moveSpeed: 0.25,       // Snabbare än normalt
            maxHealth: 3,          // Låg hälsa
            shootCooldownDuration: 1000,
            shootRange: 100,        // Kort räckvidd
            projectileConfig: projectileConfig,
        })

        const BiterrunOptions = {
            framesX: 4,
            framesY: 1,
            frameInterval: 100,
            frameWidth: 32,
            frameHeight: 32,
            sourceX: 0,
            sourceY: 0,
            scale: 1.2
        }
        this.loadSprite("seek",Biterrun, BiterrunOptions)
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
