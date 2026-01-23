import GameObject from '../GameObject.js'
import Platform from '../Platform.js'
import Field from "../assets/plants/field.png"
import Grass from "../assets/plants/grass.png"
import Barn from "../assets/player/barn.png"

/**
 * Arena för twinstick shooter
 * Skapar en arena med väggar runt kanterna och några hinder i mitten
 * Definierar också spawn points och wave konfiguration för fiender
 */
export default class TwinstickArena {
    constructor(game) {
        this.game = game
        this.tileSize = 64
        
        // Arena data
        this.walls = []
        this.floor = []
        
        // Spawn position för spelaren (mitt i arenan)
        this.playerSpawnX = game.worldWidth / 2.065
        this.playerSpawnY = game.worldHeight / 2
        
        // Enemy spawn points (definieras efter att arenan skapats)
        this.enemySpawnPoints = []
        
        // Wave konfiguration
        this.waveConfig = this.createWaveConfig()

        this.fieldScale = 192
        this.fieldPositionX = (this.game.worldWidth - this.fieldScale) / 2 
        this.fieldPositionY = (this.game.worldHeight - this.fieldScale) / 2

        this.field = new GameObject(this.game,this.fieldPositionX,this.fieldPositionY,this.fieldScale,this.fieldScale)
        this.field.loadSprite("idle",Field,1,0,96,96)
        this.field.setAnimation("idle")
        
        // Skapa arena
        this.init()
    }

    init() {
        this.createFloor()
        this.createWalls()
        this.createSpawnPoints()
    }
    
    /**
     * Skapar spawn points för fiender
     * Placerar dem vid hörnen av arenan
     */
    createSpawnPoints() {
        const margin = this.tileSize * 2 // Avstånd från kanten
        const worldWidth = this.game.worldWidth
        const worldHeight = this.game.worldHeight
        
        this.enemySpawnPoints = [
            // Övre vänster
            { x: margin, y: margin },
            // Övre höger
            { x: worldWidth - margin, y: margin },
            // Nedre vänster
            { x: margin, y: worldHeight - margin },
            // Nedre höger
            { x: worldWidth - margin, y: worldHeight - margin }
        ]
    }


    
    /**
     * Definierar waves av fiender
     * Varje wave är en array av enemy-typer som spawnas i ordning
     */
    createWaveConfig() {
        return {
            spawnPoints: [], // Fylls i av createSpawnPoints()
        }
    }

    createFloor() {
        // Skapa golv-tiles för visuell feedback
        const tilesX = Math.ceil(this.game.worldWidth / this.tileSize)
        const tilesY = Math.ceil(this.game.worldHeight / this.tileSize)
        
        for (let y = 0; y < tilesY; y++) {
            for (let x = 0; x < tilesX; x++) {
                // Alternerande färg för checkerboard-mönster
                const img = new Image()
                img.src = Grass
                
                this.floor.push({
                    x: x * this.tileSize,
                    y: y * this.tileSize,
                    width: this.tileSize,
                    height: this.tileSize,
                    image: img
                })
            }
        }
    }

    createWalls() {
        const wallThickness = this.tileSize
        const worldWidth = this.game.worldWidth
        const worldHeight = this.game.worldHeight
        
        // Väggar runt hela arenan (grå)
        const wallColor = '#666666'
        
        // Topp vägg
        this.walls.push(new Platform(this.game, 0, 0, worldWidth, wallThickness, wallColor))
        
        // Botten vägg
        this.walls.push(new Platform(this.game, 0, worldHeight - wallThickness, worldWidth, wallThickness, wallColor))
        
        // Vänster vägg
        this.walls.push(new Platform(this.game, 0, 0, wallThickness, worldHeight, wallColor))
        
        // Höger vägg
        this.walls.push(new Platform(this.game, worldWidth - wallThickness, 0, wallThickness, worldHeight, wallColor))
        
        // Två block i diagonal för visuell feedback när man rör sig
        const blockSize = this.tileSize * 3
        const blockColor = '#801313'
        
        // Block 1 - övre vänster kvadrant
        this.walls.push(new Platform(
            this.game,
            worldWidth / 2.25,
            worldHeight / 4,
            blockSize,
            blockSize,
            blockColor
        ))
        /*
        // Block 2 - nedre höger kvadrant (diagonal)
        this.walls.push(new Platform(
            this.game,
            (worldWidth * 2) / 3 - blockSize / 2,
            (worldHeight * 2) / 3 - blockSize / 2,
            blockSize,
            blockSize,
            blockColor
        ))*/
    }

    update(deltaTime) {
        // Arenan är statisk, ingen update behövs
    }

    draw(ctx, camera) {
        // Rita golvet först
        this.floor.forEach(tile => {
            const screenX = camera ? tile.x - camera.x : tile.x
            const screenY = camera ? tile.y - camera.y : tile.y
            
            // Endast rita tiles som är synliga
            if (camera && !camera.isVisible(tile)) {
                return
            }

            ctx.drawImage(
                tile.image,
                0,
                0,
                tile.width,
                tile.height,
                screenX,
                screenY,
                tile.width,
                tile.height
            )
            
            //ctx.fillStyle = tile.color
            //ctx.fillRect(screenX, screenY, tile.width, tile.height)
        })

        this.field.drawSprite(ctx,camera)
        
        // Rita väggarna
        this.walls.forEach(wall => {
            wall.draw(ctx, camera)
        })
    }

    getData() {
        return {
            walls: this.walls,
            playerSpawnX: this.playerSpawnX,
            playerSpawnY: this.playerSpawnY,
            enemySpawnPoints: this.enemySpawnPoints,
            field: this.field,
            waveConfig: {
                ...this.waveConfig,
                spawnPoints: this.enemySpawnPoints // Lägg till spawn points i config
            }
        }
    }
}
