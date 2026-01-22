import SunFlower from "./SunFlower.js";
import Tomatoes from "./Tomatoes.js";
import WiltingLilly from "./WiltingLilly.js";
import Chillies from "./Chillies.js";



export default class SeedPicker {
    constructor(game){
        this.game = game
        this.weightTable = {common: 10, rare: 5}
        this.maxWeight = 0

        for (const rarity in this.weightTable) {
            this.maxWeight += this.weightTable[rarity]
        }

        this.seeds = {
            common : ["SunFlower", "Tomatoes"],
            rare : ["WiltingLilly", "Chillies"]
        }
    }

    pickRarity() {
        let weightValue = Math.random() * this.maxWeight

        if (weightValue <= this.weightTable.common) {
            return "common"
        }
        else if (weightValue <= this.weightTable.common + this.weightTable.rare) {
            return "rare"
        }
    }

    getRandomSeed() {
        let rarity = this.pickRarity()
        let lootTable = this.seeds[rarity]
        let randomNumb = Math.floor(Math.random() * lootTable.length)
        let seedName =  lootTable[randomNumb]

        console.log(lootTable,randomNumb,seedName)

        if (seedName == "SunFlower") {
            return new SunFlower(this.game)
        }
        else if (seedName == "Tomatoes") {
            return new Tomatoes(this.game)
        }
        else if (seedName == "WiltingLilly") {
            return new WiltingLilly(this.game)
        }
        else if (seedName == "Chillies") {
            return new Chillies(this.game)
        }

    }


}