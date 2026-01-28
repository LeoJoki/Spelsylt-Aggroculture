import TwinstickEnemy from "../TwinstickEnemy.js"
import Pollinatorrun from "../../assets/enemies/pollinatorrun.png"
import plantShot from "../../assets/projectiles/plantShot.png"

/**
 * Boss fiende
 * - Mycket hög hälsa (10hp)
 * - Medel hastighet
 * - Mycket långt skjutavstånd
 * - Skjuter snabbt
 */
export default class BossEnemy extends TwinstickEnemy {
    constructor(game, x, y) {

        let spriteConfig = {
            imagePath: plantShot,
            width: 4,
            height: 4
        }

        let projectileConfig = {
            target:"player",
            speed: 0.15,
            width: 12,
            height: 12,
            maxShootRange : 1600,
            spriteConfig : spriteConfig
        }

        super(game, x, y, 64, 64, {
            moveSpeed: 0.15,        // Normal hastighet
            maxHealth: 8,        // Medel hälsa
            shootCooldownDuration: 1000,
            shootRange: 1500,
            projectileConfig : projectileConfig      // Normal räckvidd
        })

        const GunflowerrunOptions = {
            framesX: 4,
            framesY: 1,
            frameInterval: 100,
            frameWidth: 32,
            frameHeight: 32,
            sourceX: 0,
            sourceY: 32,
            scale: 1
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
