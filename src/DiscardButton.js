import UiButton from "./UiButton"
import Sprite from "./assets/player/binClosed.png"
import SpriteHover from "./assets/player/binOpen.png"
import discard from "./assets/sounds/discard.mp3"

export default class DiscardButton extends UiButton {
    constructor(game, x, y, width, height, color, visible = false) {
        super(game, x, y, width, height, color, visible)
        this.sprite = Sprite
        this.hoverSprite = SpriteHover

        this.activateSFX = new Audio(discard)
    }

    activate() {
        if (this.game.seedHolding) {
            this.game.seedHolding = null
            this.visible = false
            this.activateSFX.play()
        }
    }
}