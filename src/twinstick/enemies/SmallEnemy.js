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

        /*const BiterrunOptions = {
            framesX: 4,
            framesY: 1,
            frameInterval: 100,
            frameWidth: 32,
            frameHeight: 32,
            sourceX: 0,
            sourceY: 0,
            scale: 1
        }*/
        this.loadSprite("chase",Biterrun, /*BiterrunOptions*/)
        /*Biterrunoptions.sourcex = 0*/
        this.setAnimation("chase")

       /* this.loadSprite("shoot",Biterbiting,1,0,32,32)
        this.setAnimation("shoot")
        this.loadSprite("idle",Biter,1,0,32,32)
        this.setAnimation("idle")*/
        //fienden som slårdsaduiadbauo
        this.enemyType = 'small'
    }
    draw(ctx, camera) {
        this.drawSprite(ctx, camera)
    }
}
