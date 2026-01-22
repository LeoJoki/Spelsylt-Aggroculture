import UiButton from "./UiButton";


export default class DiscardButton extends UiButton {
    constructor(game, x, y, width, height, color, visible = false) {
        super(game, x, y, width, height, color, visible)
    }

    activate() {
        if (this.game.seedHolding) {
            this.game.seedHolding = null
            this.visible = false
        }
    }
}