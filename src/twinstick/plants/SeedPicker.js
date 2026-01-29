import SunFlower from "./SunFlower.js";
import Tomatoes from "./Tomatoes.js";
import WiltingLilly from "./WiltingLilly.js";
import Chillies from "./Chillies.js";
import PinkRose from "./PinkRose.js";
import DogBiscuit from "./DogBiscuit.js";
import Lavender from "./Lavender.js";


export default class SeedPicker {
    constructor(game){
        this.game = game
        this.weightTable = {common: 20, rare: 10, epic:5}
        this.maxWeight = 0

        for (const rarity in this.weightTable) {
            this.maxWeight += this.weightTable[rarity]
        }

        this.seeds = {
            common : ["SunFlower", "Tomatoes","DogBiscuit"],
            rare : ["WiltingLilly", "Chillies","Lavender"],
            epic : ["Pink Rose"]
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
        else if (weightValue <= this.weightTable.common + this.weightTable.rare + this.weightTable.epic) {
            return "epic"
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
        else if (seedName == "Pink Rose") {
            return new PinkRose(this.game)
        }
        else if (seedName == "DogBiscuit") {
            return new DogBiscuit(this.game)
        }
        else if (seedName == "Lavender") {
            return new Lavender(this.game)
        }


    }


}