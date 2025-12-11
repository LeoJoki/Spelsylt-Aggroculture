import InputHandler from './InputHandler.js'
import UserInterface from './UserInterface.js'
import Camera from './Camera.js'

/**
 * Abstract base class för alla speltyper
 * Innehåller gemensam funktionalitet som alla spel behöver
 */
export default class GameBase {
    constructor(width, height) {
        // Förhindra direkt instansiering av GameBase
        if (new.target === GameBase) {
            throw new Error('GameBase är en abstract class och kan inte instansieras direkt')
        }

        this.width = width
        this.height = height
        
        // World size (kan överskridas av subklasser)
        this.worldWidth = width * 3
        this.worldHeight = height

        // Gemensam game state
        this.gameState = 'PLAYING' // PLAYING, GAME_OVER, WIN
        this.score = 0

        // Gemensamma system
        this.inputHandler = new InputHandler(this)
        this.ui = new UserInterface(this)
        
        // Camera
        this.camera = new Camera(0, 0, width, height)
        this.camera.setWorldBounds(this.worldWidth, this.worldHeight)

        // Gemensamma arrays
        this.enemies = []
    }

    /**
     * Abstract method - måste implementeras av subklasser
     * Initierar spel-specifika objekt och state
     */
    init() {
        throw new Error('init() måste implementeras av subklass')
    }

    /**
     * Abstract method - måste implementeras av subklasser
     * Återställer spelet till initial state
     */
    restart() {
        throw new Error('restart() måste implementeras av subklass')
    }

    /**
     * Abstract method - måste implementeras av subklasser
     * Uppdaterar spelets logik varje frame
     */
    update(deltaTime) {
        throw new Error('update() måste implementeras av subklass')
    }

    /**
     * Abstract method - måste implementeras av subklasser
     * Ritar spelet på canvas
     */
    draw(ctx) {
        throw new Error('draw() måste implementeras av subklass')
    }
}
