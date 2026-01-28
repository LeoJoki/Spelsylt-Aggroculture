import Menu from './Menu.js'
import MainMenu from './MainMenu.js'

export default class TutorialMenu extends Menu {
    getTitle() {
        return 'Tutorial'
    }
    
    getOptions() {
        return [
            {
                text: 'Back to Menu',
                key: 'Escape',
                action: () => {
                    this.game.gameState = 'MENU'
                    this.game.currentMenu = new MainMenu(this.game)
                }
            }
        ]
    }
}
