import Menu from './Menu.js'

export default class GameOverMenu extends Menu {
    getTitle() {
        return 'Game Over Menu'
    }
    
    getOptions() {
        return [
            {
                text: 'Restart Game',
                key: 'r',
                action: () => {
                    this.game.restart()
                    this.game.currentMenu = null
                    this.game.inputHandler.keys.clear()
                }
            },
        ]
    }
}
