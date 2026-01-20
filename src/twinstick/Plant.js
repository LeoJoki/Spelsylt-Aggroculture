import GameObject from "../GameObject.js"

//Detta är ett objekt för den ruta där man kan plantera ett frö så att det kan bli till en växt


export default class Plant extends GameObject {
    constructor(game, x, y, width, height) {
        super(game, x, y, width, height)

    }
}