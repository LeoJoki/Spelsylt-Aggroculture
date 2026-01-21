import GameObject from "../GameObject.js"

//Detta är ett objekt för den ruta där man kan plantera ett frö så att det kan bli till en växt

//--- FORMAT FÖR ATT HÄMTA BILDER FRÅN "plants" inom "assets"
//"../assets/plants/IMAGEFILENAME"

export default class Plant extends GameObject {
    constructor(game, config = {}) {
        let width = config.width ? config.width : 32
        let height = config.height ? config.height : 32

        super(game, 0, 0, width, height)

        this.player = game.player
        this.givingBuff = false

        this.name = config.name ? config.name : "Nameless Plant"
        this.rarity = config.rarity ? config.rarity : "Unkown"
        this.description = config.description ? config.description : "no description"
        this.wavesTillGrown = config.wavesTillGrown ? config.wavesTillGrown : 1

        this.growingSprite = config.growingSprite
        this.grownSprite = config.grownSprite
    }

    applyBuff() {
        //är en funktion som används av klasser som extendar utifrån denna,
        //bestämmer vad som denna planta ska ge spelaren när den väl är fullvuxen.
    }

    removeBuff() {
        //är en funktion som används av klasser som extendar utifrån denna,
        //vänder på effekten som applyBuff() giver, tar bort buffen helt enkelt
    }
}