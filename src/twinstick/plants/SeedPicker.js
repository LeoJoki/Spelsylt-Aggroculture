import TestPlant from "./testplant";



export default class SeedPicker {
    constructor(game){
        this.game = game
        this.weightTable = {common: 10, rare: 3}
        this.maxWeight = 0

        for (const rarity in this.weightTable) {
            this.maxWeight += this.weightTable[rarity]
        }

        this.seeds = {
            common : ["TestPlant"],
            rare : ["TestPlant"]
        }
    }

    pickRarity() {
        let weightValue = Math.random() * this.maxWeight

        console.log(weightValue)

        if (weightValue <= this.weightTable.common) {
            console.log("common")
            return "common"
        }
        else if (weightValue <= this.weightTable.common + this.weightTable.rare) {
            console.log("rare")
            return "rare"
        }
    }

    getRandomSeed() {
        let rarity = this.pickRarity()
        let lootTable = this.seeds[rarity]
        let randomNumb = Math.floor(Math.random() * lootTable.length)
        let seedName =  lootTable[randomNumb]

        console.log(lootTable,randomNumb,seedName)

        if (seedName == "TestPlant") {
            return new TestPlant(this.game)
        }
    }


}