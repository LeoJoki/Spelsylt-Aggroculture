import TwinstickEnemy from "../TwinstickEnemy.js"
import Pitcherrun from "../../assets/enemies/pitcherrun.png"
import plantShot from "../../assets/projectiles/acidBlob.png"

/**
 * Stor långsam fiende
 * - Hög hälsa (5hp)
 * - Låg hastighet
 * - Långt skjutavstånd
 */
export default class LargeEnemy extends TwinstickEnemy {
    constructor(game, x, y) {
        let spriteConfig = {
            imagePath: plantShot,
            width: 4,
            height: 4
        }

        let projectileConfig = {
            target:"player",
            speed: 0.15,
            width: 20,
            height: 20,
            maxShootRange : 100,
            spriteConfig : spriteConfig,
            spawnAcid : true
        }

        super(game, x, y, 80, 80, {
            color: '#8B4513',      // Brun
            moveSpeed: 0.15,       // Långsam
            maxHealth: 15,          // Hög hälsa
            shootCooldownDuration: 1500,
            shootRange: 150,    
            projectileConfig: projectileConfig    // Kort räckvidd     // Lång räckvidd
        })

        const PitcherrunOptions = {
            framesX: 4,
            framesY: 1,
            frameInterval: 150,
            frameWidth: 32,
            frameHeight: 32,
            sourceX: 15,
            sourceY: 0,
            scale: 1
        }
        this.loadSprite("seek",Pitcherrun, PitcherrunOptions)
        this.setAnimation("seek")
        //fienden som slår fast stor
        this.enemyType = 'large'
    }
    update(deltaTime){
        super.update(deltaTime)
        this.updateAnimation(deltaTime)
    }

    draw(ctx, camera) {
        this.drawSprite(ctx, camera)
    }
}

