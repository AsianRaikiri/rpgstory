import { getRandomNumber } from "../utils/math";
import { ability, fight_stats } from '../types';
import { PlayerUI, sleep } from "./ui";

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
        if(this.initiativeList[next].initiative > this.initiativeList[last].initiative){
            var tempHolder : fight_stats = this.initiativeList[last]
            this.initiativeList[last] = this.initiativeList[next]
            this.initiativeList[next] = tempHolder
        }
    }

    public async MainLoop(){
        while (!this.fightOver()){
            UI.resetScreen()
            console.log(UI.getBattleUi(this.player, this.enemyList, this.initiativeList))
            var activeCharacter = this.initiativeList[this.activeInitiative]
            if (activeCharacter == this.player){
                var [action, target] = await UI.askForActionAndTarget(this.player, this.enemyList)
            }else{
                var action: ability = await this.getRandomEnemyAction(activeCharacter)
                var target: fight_stats = this.player
            }

            await this.applyAction(action, activeCharacter, target)

            await this.updateStats()
            await this.moveDeadEnemies()
            this.activeInitiative += 1
            if(this.activeInitiative >= this.initiativeList.length){
                this.activeInitiative = 0;
            }
        }
        return this.player
    }
    
    private async getRandomEnemyAction(enemyCharacter: fight_stats): Promise<ability> {
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
        await sleep()
        var charIndex = this.initiativeList.findIndex((character: fight_stats) => character.name == user.name)
        this.initiativeList[charIndex] = user
        var charIndex = this.initiativeList.findIndex((character: fight_stats) => character.name == target.name)
        this.initiativeList[charIndex] = target
        if(target.name == this.player.name){
            this.player = target
        }else if(user.name == this.player.name){
            this.player = user
        }
    }

    private async updateStats(){
        this.initiativeList.forEach((character: fight_stats) => {
            if (character.name == this.player.name){
                this.player = character
                return
            }

            var enemyListIndex = this.enemyList.findIndex((char: fight_stats) => char.name == character.name)
            if(character.HP > 0){
                this.enemyList[enemyListIndex] = character
            }
            });
    }

    private async moveDeadEnemies(){
        this.enemyList.forEach((enemy: fight_stats, index)=>{
            if(enemy.HP <= 0){
                var initiativeIndex = this.initiativeList.findIndex((char: fight_stats)=> char.name == enemy.name)
                this.initiativeList.splice(initiativeIndex, 1)
                this.enemyList.splice(index, 1)
                this.deadEnemies.push(enemy)
            }
        })
    }

    private fightOver() : boolean {
        return (this.enemyList.length == 0) || (this.player.HP <= 0)
    }
}