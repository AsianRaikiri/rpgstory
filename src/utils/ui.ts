import UI from "cliui"
import { ability, characterFile, enemy_file, fight_stats } from '../types';
import { PlaceHolder } from "./placeholder"
import Enquirer from "enquirer";

export class PlayerUI{
    readonly width: number
    readonly ui: ReturnType<typeof UI>
    
    constructor(width: number = 80){
        this.width = width
        this.ui = UI({width: this.width})
    }
    
    getBattleUi(character: fight_stats, enemyList: fight_stats[]){
        this.addVoid()
        this.addEnemyListUI(enemyList)
        this.addVoid()
        this.addBar()
        this.addVoid()
        this.addUserStats(character)
        this.addVoid()
        return this.getUiString()
    }

    addVoid(){
        this.ui.div("")
    }

    addBar(){
		var str = "=".repeat(this.width)
		this.ui.div({text: str, padding: [0, 0, 0, 0]})
    }

    resetUi() {
        return this.ui.resetOutput()
    }

    resetScreen() {
        this.resetUi()
        console.clear()
    }
    getUiString(){
        return this.ui.toString()
    }

	private addEnemyListUI(enemyList: fight_stats[]) {

		for (const enemy of enemyList) {
			let r1 = ''
			let r2 = ''

            r1 = enemy.name
            r2 = `HP: ${enemy.HP} / ${enemy.max_HP}`
			
			this.ui.div(
				{ text: r1, align: 'left', padding: [0,0,0,8] },
				{ text: r2, align: 'right', padding: [0,2,0,0] } )
		}
	}
    addUserStats( character: fight_stats ) {

		this.ui.div(
			{ text: character.name, padding: [0,0,0,0], align: 'center' },
		)

		this.ui.div(
			{ text: `HP: ${character.HP} / ${character.max_HP}`, padding: [0,0,0,0], align: 'center' },
			{ text: `Mana: ${character.mana} / ${character.max_mana}`, padding: [0,0,0,0], align: 'center' },
			{ text: `Stamina: ${character.stamina} / ${character.max_stamina}`, padding: [0,0,0,0], align: 'center' },
		)
	}
    async askForActionAndTarget(character: fight_stats, enemyList: fight_stats[]) : Promise<[ability, fight_stats]> {
    //Make the enquirer that gets the actual user actions 
        const enquirer: Enquirer = new Enquirer();
        const ability_names: string[] = await character.active_abilities.map((current_ability: ability) => current_ability.name)
        const enemy_names: string[] = await enemyList.map((enemy: fight_stats) => enemy.name)
        var answers: Record<string, any>  = await enquirer.prompt([
            {
                type: "select",
                name: "abilityName",
                message: "What ability do you want to use?",
                choices: ability_names,
            },
            {
                type: "select",
                name: "targetName",
                message: "Who do you want to target?",
                choices: enemy_names,
            },      
        ])
        const ability_index: number = character.active_abilities.findIndex((current_ability: ability) => current_ability.name == answers.abilityName)
        const target_index: number = enemyList.findIndex((enemy: fight_stats) => enemy.name == answers.targetName)
        return [character.active_abilities[ability_index], enemyList[target_index]]
    }
}