import Menu from './Menu.js'
import CreditsMenu from './CreditsMenu.js'

export default class MainMenu extends Menu {
    getTitle() {
        return 'Game Menu'
    }
    
    getOptions() {
        return [
            {
                text: 'Start Game',
                key: ' ',
                action: () => {
                    this.game.gameState = 'PLAYING'
                    this.game.currentMenu = null
                    this.game.inputHandler.keys.clear()
                }
            },
            {
                text: 'Credits',
                key: 'c',
                action: () => {
                    this.game.gameState = 'CREDITS'
                    this.game.currentMenu = new CreditsMenu(this.game)
                }
            }
        ]
    }
}
