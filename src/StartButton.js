import UiButton from "./UiButton"
import Sprite from "./assets/player/startButton.png"

export default class StartButton extends UiButton {
    constructor(game, x, y, width, height, color, visible = false) {
        super(game, x, y, width, height, color, visible)
        this.sprite = Sprite

        this.frameWidth = 200
        this.frameHeight = 100
    }

    activate() {
        this.game.gameState = 'PLAYING'
        this.game.currentMenu = null
        this.game.inputHandler.keys.clear()
    }
}