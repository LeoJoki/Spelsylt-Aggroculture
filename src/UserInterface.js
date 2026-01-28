import DiscardButton from "./DiscardButton"
import GameObject from "./GameObject"
import UiButton from "./UiButton"

export default class UserInterface {
    constructor(game) {
        this.game = game
        this.fontSize = 24
        this.fontFamily = 'Arial'
        this.textColor = '#FFFFFF'
        this.shadowColor = '#000000'

        this.uiButtons = []

        this.discardButton = new DiscardButton(game,game.width - 400, game.height - 100, 64, 64, "red")
        this.uiButtons.push(this.discardButton)
    }

    draw(ctx) {
        // Rita HUD (score, health, etc)
        this.drawHUD(ctx)

        // Rita game state overlays
        if (this.game.gameState === 'GAME_OVER') {
            this.drawGameOver(ctx)
        } else if (this.game.gameState === 'WIN') {
            this.drawWin(ctx)
        } else if (this.game.gameState === 'MENU') {
            this.drawMenu(ctx)
        } else if (this.game.gameState === 'CREDITS') {
            this.drawCredits(ctx)
        } else if (this.game.gameState === 'TUTORIAL') {
            this.drawTutorial(ctx)
        }
    }

    drawHUD(ctx) {
        ctx.save()

        // Konfigurera text
        ctx.font = `${this.fontSize}px ${this.fontFamily}`
        ctx.fillStyle = this.textColor
        ctx.shadowColor = this.shadowColor
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2
        ctx.shadowBlur = 3

        // Top-left: Health hearts
        if (this.game.player) {
            // Rita health hearts (röda fyrkanter)
            this.drawHealthHearts(ctx, 20, 20)
        }
        
        // Top-right: Ammo display (twinstick)
        if (this.game.player && this.game.player.currentAmmo !== undefined) {
            this.drawAmmoBoxes(ctx, this.game.width - 20, 20)
        }
        
        // Om spelet har coins (platformer), visa dem
        if (this.game.coinsCollected !== undefined) {
            ctx.fillText(`Coins: ${this.game.coinsCollected}`, 20, 80)
        }

        if (this.uiButtons) {
            this.drawUiButtons(ctx)
        }

        // Bottom-right: Score
        ctx.textAlign = 'right'
        ctx.fillText(`Score: ${this.game.score}`, this.game.width - 20, this.game.height - 20)
        ctx.textAlign = 'left'

        ctx.textAlign = 'right'
        ctx.fillText(`Wave: ${this.game.spawner.currentWave + 1}`, this.game.width - 20, this.game.height - 640)
        ctx.textAlign = 'left'

        ctx.textAlign = 'right'
        ctx.fillText(`Enemies left: ${this.game.spawner.enemiesInWave - this.game.spawner.enemiesKilled}`, this.game.width - 20, this.game.height - 600)
        ctx.textAlign = 'left'

        if (this.game.seedHolding) {
            this.drawSeedHolding(ctx)
        }

        ctx.restore()
        
        // Rita reload indicator ovanför spelaren (i world space)
        if (this.game.player && this.game.player.dashCooldown > 0) {
            this.drawReloadIndicator(ctx)
        }
    }

    drawUiButtons(ctx) {
        this.uiButtons.forEach(button => {
            button.draw(ctx)
        })
    }

    drawHealthHearts(ctx, x, y) {
        const heartSize = 24
        const heartSpacing = 4
        const totalHearts = this.game.player.maxHealth
        const currentHearts = this.game.player.health
        
        ctx.save()
        
        for (let i = 0; i < totalHearts; i++) {
            const heartX = x + i * (heartSize + heartSpacing)
            
            if (i < currentHearts) {
                // Full hälsa - röd fyrkant
                ctx.fillStyle = '#FF0000'
            } else {
                // Förlorad hälsa - mörk grå
                ctx.fillStyle = '#333333'
            }
            
            ctx.fillRect(heartX, y, heartSize, heartSize)
            
            // Vit kant
            ctx.strokeStyle = '#FFFFFF'
            ctx.lineWidth = 2
            ctx.strokeRect(heartX, y, heartSize, heartSize)
        }
        
        ctx.restore()
    }
    
    drawAmmoBoxes(ctx, x, y) {
        const boxSize = 16
        const boxSpacing = 4
        const maxDisplay = this.game.player.maxAmmo
        const totalAmmo = this.game.player.currentAmmo
        
        ctx.save()
        
        // Beräkna hur många rutor som ska visas
        const displayBoxes = Math.min(this.game.player.maxAmmo, maxDisplay)
        
        // Rita boxarna från höger till vänster
        for (let i = 0; i < displayBoxes; i++) {
            const boxX = x - (i + 1) * (boxSize + boxSpacing)
            
            if (i < totalAmmo) {
                // Ammo finns - gul box
                ctx.fillStyle = '#FFD700'
            } else {
                // Tom - mörk grå
                ctx.fillStyle = '#333333'
            }
            
            ctx.fillRect(boxX, y, boxSize, boxSize)
            
            // Vit kant
            ctx.strokeStyle = '#FFFFFF'
            ctx.lineWidth = 2
            ctx.strokeRect(boxX, y, boxSize, boxSize)
        }
        
        // Rita reserve ammo under boxarna
        const reserveY = y + boxSize * 2 + 8
        ctx.font = '18px Arial'
        ctx.fillStyle = 'rgba(255, 215, 0, 0.8)'
        ctx.textAlign = 'right'
        ctx.shadowColor = '#000000'
        ctx.shadowOffsetX = 1
        ctx.shadowOffsetY = 1
        ctx.shadowBlur = 2
        ctx.fillText(`+${this.game.player.reserveAmmo}`, x, reserveY)
        
        ctx.restore()
    }
    
    drawReloadIndicator(ctx) {
        // Rita ovanför spelaren i world space
        const player = this.game.player
        const camera = this.game.camera
        
        // Beräkna position ovanför spelaren
        const worldX = player.x + player.width / 1.2
        const worldY = player.y - 30
        const screenX = camera ? worldX - camera.x : worldX
        const screenY = camera ? worldY - camera.y : worldY
        
        ctx.save()
        
        // Reload progress bar
        const barWidth = 60
        const barHeight = 8
        const reloadPercent = 1 - (player.dashCooldown / player.dashCooldownDuration)
        
        // Bakgrund
        ctx.fillStyle = '#333'
        ctx.fillRect(screenX - barWidth / 2, screenY, barWidth, barHeight)
        
        // Progress
        ctx.fillStyle = '#969696'
        ctx.fillRect(screenX - barWidth / 2, screenY, barWidth * reloadPercent, barHeight)
        
        // Kant
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 1
        ctx.strokeRect(screenX - barWidth / 2, screenY, barWidth, barHeight)
        
        // Text under progress bar
        /*ctx.font = '12px Arial'
        ctx.fillStyle = '#FFC107'
        ctx.textAlign = 'center'
        ctx.fillText('RELOADING', screenX, screenY + barHeight + 14)*/
        
        ctx.restore()
    }

    drawHealthBar(ctx, x, y) {
        const barWidth = 200
        const barHeight = 20
        const healthPercent = this.game.player.health / this.game.player.maxHealth

        ctx.save()

        // Bakgrund (grå)
        ctx.fillStyle = '#333'
        ctx.fillRect(x, y, barWidth, barHeight)

        // Nuvarande health (röd till grön gradient)
        const healthWidth = barWidth * healthPercent

        // Färg baserat på health procent
        if (healthPercent > 0.5) {
            ctx.fillStyle = '#4CAF50' // Grön
        } else if (healthPercent > 0.25) {
            ctx.fillStyle = '#FFC107' // Gul
        } else {
            ctx.fillStyle = '#F44336' // Röd
        }

        ctx.fillRect(x, y, healthWidth, barHeight)

        // Kant
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, barWidth, barHeight)

        ctx.restore()
    }
    // Obs: drawHealthBar() används fortfarande av platformer-spelet

    drawGameOver(ctx) {
        // Halvgenomskinlig bakgrund
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        ctx.fillRect(0, 0, this.game.width, this.game.height)

        // Game Over text
        ctx.save()
        ctx.fillStyle = '#FF0000'
        ctx.font = 'bold 60px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('GAME OVER', this.game.width / 2, this.game.height / 2 - 50)

        // Score
        ctx.fillStyle = '#FFFFFF'
        ctx.font = '30px Arial'
        ctx.fillText(`Final Score: ${this.game.score}`, this.game.width / 2, this.game.height / 2 + 20)

        // Restart instruktion
        ctx.font = '24px Arial'
        ctx.fillText('Press R to Restart', this.game.width / 2, this.game.height / 2 + 120)
        ctx.restore()
    }

    drawWin(ctx) {
        // Halvgenomskinlig bakgrund
        ctx.fillStyle = 'rgba(0, 255, 0, 0.3)'
        ctx.fillRect(0, 0, this.game.width, this.game.height)

        // Victory text
        ctx.save()
        ctx.fillStyle = '#FFD700'
        ctx.font = 'bold 60px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('VICTORY!', this.game.width / 2, this.game.height / 2 - 50)

        // Score
        ctx.fillStyle = '#FFFFFF'
        ctx.font = '30px Arial'
        ctx.fillText(`Final Score: ${this.game.score}`, this.game.width / 2, this.game.height / 2 + 60)

        // Restart instruktion
        ctx.font = '24px Arial'
        ctx.fillText('Press R to Play Again', this.game.width / 2, this.game.height / 2 + 120)
        ctx.restore()
    }

    drawMenu(ctx) {
        ctx.fillStyle = '#087509'
        ctx.fillRect(0, 0, this.game.width, this.game.height)
        ctx.fillStyle = '#000000'
        ctx.textAlign = 'center'
        ctx.font = '46px Arial'
        ctx.fillText(`AGGROCULTURE!`, this.game.width / 2, this.game.height - 500)
        ctx.font = '28px Arial'
        ctx.fillText(`Press SPACE to start!`, this.game.width / 2, this.game.height - 450)
        ctx.fillText(`Press C for credits!`, this.game.width / 2, this.game.height - 410)
        ctx.fillText(`Press V for a tutorial!`, this.game.width / 2, this.game.height - 370)
        ctx.textAlign = 'left'
    }

    drawCredits(ctx) {
        ctx.fillStyle = '#B8008A'
        ctx.fillRect(0, 0, this.game.width, this.game.height)
        ctx.fillStyle = '#FFFFFF'
        ctx.textAlign = 'center'
        ctx.font = '46px Arial'
        ctx.fillText(`Credits!`, this.game.width / 2, this.game.height - 500)
        ctx.font = '28px Arial'
        
        ctx.fillText(`Art Team`, this.game.width / 2, this.game.height - 450)
        ctx.font = '20px Arial'
        ctx.fillText(`Axel (ES23)`, this.game.width / 2, this.game.height - 420)
        ctx.fillText(`Hilma (ES23)`, this.game.width / 2, this.game.height - 390)
        
        ctx.font = '28px Arial'
        ctx.fillText(`Programming Team`, this.game.width / 2, this.game.height - 350)
        ctx.font = '20px Arial'
        ctx.fillText(`Rasmus (TE23)`, this.game.width / 2, this.game.height - 320)
        ctx.fillText(`Oliver (TE23)`, this.game.width / 2, this.game.height - 290)
        ctx.fillText(`Leo (TE23)`, this.game.width / 2, this.game.height - 260)

        ctx.font = '28px Arial'
        ctx.fillText(`Management`, this.game.width / 2, this.game.height - 220)
        ctx.font = '20px Arial'
        ctx.fillText(`Olle (TE4)`, this.game.width / 2, this.game.height - 190)
        ctx.fillText(`Herman (TE4)`, this.game.width / 2, this.game.height - 160)

        ctx.font = '16px Arial'
        ctx.fillText(`Press ESC to go back`, this.game.width / 2, this.game.height - 130)
        ctx.textAlign = 'left'
    }

    drawTutorial(ctx) {
        ctx.fillStyle = '#008aa6'
        ctx.fillRect(0, 0, this.game.width, this.game.height)
        ctx.fillStyle = '#000000'
        ctx.textAlign = 'center'
        ctx.font = '46px Arial'
        ctx.fillText(`Tutorial!`, this.game.width / 2, this.game.height - 500)
        ctx.font = '28px Arial'
        ctx.fillText(`Player:`, this.game.width / 2, this.game.height - 450)
        ctx.fillText(`Planting:`, this.game.width / 2, this.game.height - 330)
        ctx.font = '20px Arial'
        ctx.fillText(`WASD for movement`, this.game.width / 2, this.game.height - 420)
        ctx.fillText(`Mouse to aim and Left Click to shoot`, this.game.width / 2, this.game.height - 395)
        ctx.fillText(`Space to dodge`, this.game.width / 2, this.game.height - 370)
        ctx.fillText(`After defeating a wave you get a seed!`, this.game.width / 2, this.game.height - 300)
        ctx.fillText(`Click on a dirt pile to plant the seed or click the red button to discard it.`, this.game.width / 2, this.game.height - 275)
        ctx.fillText(`The plant will become fully grown after a number of waves.`, this.game.width / 2, this.game.height - 250)
        ctx.fillText(`Fully grown plants will make you stronger!`, this.game.width / 2, this.game.height - 225)

        ctx.font = '16px Arial'
        ctx.fillText(`Press ESC to go back`, this.game.width / 2, this.game.height - 200)
        ctx.textAlign = 'left'
    }

    drawSeedHolding(ctx) {
        ctx.font = "25px Verdana"
        ctx.fillStyle = "white"
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        ctx.shadowColor = '#000000'
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2

        this.discardButton.visible = true

        ctx.fillText(`You got a ${this.game.seedHolding.name}` ,this.game.width/2,this.game.height - 80)

        ctx.font = "20px Verdana"
        ctx.fillStyle = '#b6b6b6'

        ctx.fillText(`${this.game.seedHolding.rarity}` ,this.game.width/2,this.game.height - 50)

        ctx.font = "18px Verdana"


        ctx.fillText(`${this.game.seedHolding.description}` ,this.game.width/2,this.game.height - 20)

        

       
        
    }
}
