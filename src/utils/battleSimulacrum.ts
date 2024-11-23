import { getRandomNumber } from "../utils/math";
import { ability, fight_stats, cost_type, characterClass } from '../types';
import { PlayerUI } from "./ui";


const UI = new PlayerUI()

export class BattleSimulacrum{
    player: fight_stats
    enemyList: fight_stats[]
    deadEnemies: fight_stats[]
    activeInitiative: number
    initiativeList: fight_stats[]
    
    constructor(player: fight_stats, enemyList: fight_stats[]){
        this.player = player
        this.enemyList = enemyList
        this.deadEnemies = []
        this.activeInitiative = 0
        this.initiativeList = []
        this.createInitiativeList()
    }

    private createInitiativeList(){
        this.initiativeList[0] = this.player
        this.enemyList.forEach(enemy => {
            this.initiativeList.push(enemy)
        });
        if (this.initiativeList.length != 0){
            this.sortInitiativeList()        
        }
    }

    private sortInitiativeList(){
        for (let i = 0; i < this.initiativeList.length; i++){
            for ( let j = 0; j < this.initiativeList.length - 1; j++){
                this.sortTwo(j+1, j);
            }
        }
    }

    private sortTwo(next: number, last: number){
        console.log("This is the thing" + typeof(this.initiativeList[next]))
        if(this.initiativeList[next].initiative > this.initiativeList[last].initiative){
            var tempHolder : fight_stats = this.initiativeList[last]
            this.initiativeList[last] = this.initiativeList[next]
            this.initiativeList[next] = tempHolder
        }
    }

    public async MainLoop(){
        while (!this.fightOver()){
            UI.resetScreen()
            console.log(UI.getBattleUi(this.player, this.enemyList))
            var activeCharacter = this.initiativeList[this.activeInitiative]
            if (activeCharacter == this.player){
                var [action, target] = await UI.askForActionAndTarget(this.player, this.enemyList)
            }else{
                var action: ability = await this.getRandomEnemyAction(activeCharacter)
                var target: fight_stats = this.player
            }

            await this.applyAction(action, activeCharacter, target)

            await this.updateStats()

            this.activeInitiative += 1
            if(this.activeInitiative == this.initiativeList.length){
                this.activeInitiative = 0;
            }
        }
        return this.player
    }
    
    private async getRandomEnemyAction(enemyCharacter: fight_stats): Promise<ability> {
        console.log("This is not working: " + typeof(enemyCharacter))
        var randomNumber = getRandomNumber(0, enemyCharacter.active_abilities.length-1)
        return enemyCharacter.active_abilities[randomNumber]
    }

    private async applyAction(action: ability, user: fight_stats, target: fight_stats){
        switch(action.cost_type){
            case "Health": {
                user.HP = user.HP - action.cost_amount
                break
            }
            case "Mana": {
                user.mana = user.mana - action.cost_amount
                break
            }
            case "Stamina": {
                user.stamina = user.stamina - action.cost_amount
            }
        }
        target.HP = target.HP - action.damage_amount
        console.log(`> ${user.name} paying ${action.cost_amount} of ${action.cost_type} to use ${action.name}.`)
        console.log(`> ${user.name} dealing ${target.name} ${action.damage_amount} of damage with ${action.name}.`)
        this.initiativeList.forEach(character => {
            if(character.name == target.name){
                var charIndex = this.initiativeList.indexOf(character)
                this.initiativeList[charIndex] = target
            }
            if(character.name == user.name){
                var charIndex = this.initiativeList.indexOf(character)
                this.initiativeList[charIndex] = user
            }
        })
    }

    private async updateStats(){
        this.initiativeList.forEach(character => {
            if (character == this.player){
                this.player = character
            }else {
                var enemyListIndex = this.enemyList.indexOf(character)
                if(character.HP > 0){
                    this.enemyList[enemyListIndex] = character
                }else{
                    this.initiativeList.splice(this.activeInitiative, 1)
                    this.enemyList.splice(enemyListIndex, 1)
                    this.deadEnemies.push(character)
                }
            }
        });
    }

    private fightOver() : boolean {
        return (this.enemyList.length == 0) || (this.player.HP == 0)
    }
}