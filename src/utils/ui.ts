import UI from "cliui"

export class PlayerUI{
    readonly width: number
    readonly ui: ReturnType<typeof UI>
    
    constructor(width: number){
        this.width = width
        this.ui = UI({width: this.width})
    }
    
    resetUi() {
        return this.ui.resetOutput()
    }



    resetScreen() {
        this.resetUi()
        console.clear()
    }

}