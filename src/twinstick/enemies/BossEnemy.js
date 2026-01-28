import TwinstickEnemy from "../TwinstickEnemy.js"
import Pollinatorrun from "../../assets/enemies/pollinatorrun.png"
import plantShot from "../../assets/projectiles/plantShot.png"

import biteSFX from "../../assets/sounds/woosh.wav"

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

        let biteSound = new Audio(biteSFX)
        biteSound.volume = 0.05
        biteSound.preservesPitch = false

        let projectileConfig = {
            target:"player",
            speed: 0.15,
            width: 12,
            height: 12,
            maxShootRange : 2500,
            spriteConfig : spriteConfig
        }

        super(game, x, y, 64, 64, {
            moveSpeed: 0.15,        // Normal hastighet
            maxHealth: 15,        // Medel hälsa
            shootCooldownDuration: 1000,
            shootRange: 2500,
            projectileConfig : projectileConfig,
            attackSound : biteSound     // Normal räckvidd
        })

        const PollinatorrunOptions = {
            framesX: 3,
            framesY: 1,
            frameInterval: 500,
            frameWidth: 64,
            frameHeight: 64,
            sourceX: 0,
            sourceY: 0,
            scale: 1.2
        }
        this.loadSprite("seek", Pollinatorrun, PollinatorrunOptions)
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
