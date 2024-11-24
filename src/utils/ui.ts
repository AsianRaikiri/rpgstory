import UI from "cliui"
import { ability, characterFile, enemy_file, fight_stats } from '../types';
import Enquirer from "enquirer";
import { getFreeStats } from "../commands/edit_character";


export const sleep = (ms = 2000) => new Promise( (r) => setTimeout( r, ms ) )

export class PlayerUI{
    readonly width: number
    readonly ui: ReturnType<typeof UI>
    
    constructor(width: number = 80){
        this.width = width
        this.ui = UI({width: this.width})
    }
    
    getBattleUi(character: fight_stats, enemyList: fight_stats[], initiativeList: fight_stats[]){
        this.addBar()
        this.addVoid()
        this.addInitiative(initiativeList)
        this.addVoid()
        this.addBar()
        this.addEnemyListUI(enemyList)
        this.addVoid()
        this.addBar()
        this.addVoid()
        this.addUserStats(character)
        this.addVoid()
        return this.getUiString()
    }

    getPlayerAllStats(character: characterFile){
        this.addBar()
        this.addPlayerStats(character)
        this.addBar()
        return this.getUiString()
    }

    getPlayerBaseStats(character: characterFile){
        this.addBar()
        this.addStatBlock(character)
        this.addBar()
        return this.getUiString()
    }

    getAbilities(character: characterFile){
        this.addBar()
        this.addAbilities(character)
        this.addBar()
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

            let r1 = enemy.name
            let r2 = `HP: ${enemy.HP} / ${enemy.max_HP}`
			
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

    addPlayerStats(character: characterFile){
        this.addExp(character)
        this.addBar()
        this.addBaseStats(character)
        this.addBar()
        this.addStatBlock(character)
    }
    addBaseStats(character: characterFile){
        this.ui.div(
			{ text: `HP: ${character.statBlock.HP} / ${character.statBlock.max_HP}`, padding: [0,0,0,0], align: 'left' },
			{ text: `Mana: ${character.statBlock.mana} / ${character.statBlock.max_mana}`, padding: [0,0,0,0], align: 'left' },
			{ text: `Stamina: ${character.statBlock.stamina} / ${character.statBlock.max_stamina}`, padding: [0,0,0,0], align: 'left' },
		)
    }


    addStatBlock(character: characterFile){
        var free_stats = getFreeStats(character)
        this.ui.div(
			{ text: `Total Stats: ${character.statBlock.total_stat_points}`, padding: [0,0,0,0], align: 'left' },
            { text: `Free Stat Points: ${free_stats}`, padding: [0,0,0,0], align: 'left' }

        )        
        this.addBar
        this.ui.div(
			{ text: `Strength: ${character.statBlock.base_stats.strength}`, padding: [0,0,0,0], align: 'left' }
        )
        this.ui.div(
            { text: `Dexterity: ${character.statBlock.base_stats.dexterity}`, padding: [0,0,0,0], align: 'left' }
        )
        this.ui.div(
            { text: `Constitution: ${character.statBlock.base_stats.constitution}`, padding: [0,0,0,0], align: 'left' }
        )
        this.ui.div(
			{ text: `Intelligence: ${character.statBlock.base_stats.intelligence}`, padding: [0,0,0,0], align: 'left' }
        )
        this.ui.div(
			{ text: `Wisdom: ${character.statBlock.base_stats.wisdom}`, padding: [0,0,0,0], align: 'left' }
        )
        this.ui.div(
			{ text: `Charisma: ${character.statBlock.base_stats.charisma}`, padding: [0,0,0,0], align: 'left' }
        )
    }
    addExp(character: characterFile){
        this.ui.div(
            { text: `${character.name} ${character.class.name} Level ${character.class.level}`, padding: [0,0,0,0], align: 'left'},
            {text: `Available Exp: ${character.exp}`, padding: [0,0,0,0], align:'left'}

        )
    }
    addAbilities(character: characterFile){
        character.active_abilities.forEach((current_ability: ability)=>{
            this.ui.div(
                {text: `${current_ability.name}:`, padding: [0,0,0,0], align: 'left'},                
                {text: `Resource Cost: ${current_ability.cost_amount} ${current_ability.cost_type}`, padding: [0,0,0,0], align: 'left'},
                {text: `Description: \n${current_ability.description}`, padding: [0,0,0,0], align: 'left'}
            )
            this.addBar()
        })
    }
    addInitiative(initiativeList: fight_stats[]){
		for (const character of initiativeList) {

            let r1 = character.name
            let r2 = `Initiative: ${character.initiative}`
			
			this.ui.div(
				{ text: r1, align: 'left', padding: [0,0,0,8] },
				{ text: r2, align: 'right', padding: [0,2,0,0] } )
		}
    }
}