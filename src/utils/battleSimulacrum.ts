import { getRandomNumber } from "../commands/start_battle";
import { ability, fight_stats, cost_type, characterClass } from '../types';

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
        this.sortInitiativeList()
    }

    private sortInitiativeList(){
        for (let i = 0; i < this.initiativeList.length; i++){
            for ( let j = 0; j < this.initiativeList.length + i - 1; j++){
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
            //TODO: While in Loop, update Battle UI
            var activeCharacter = this.initiativeList[this.activeInitiative]
            if (activeCharacter == this.player){
                var action: ability = await this.getPlayerAction()
                //TODO: Change that to get actual target instead of random enemy
                var target: fight_stats = this.enemyList[getRandomNumber(0, this.enemyList.length - 1)]
            }else{
                var action: ability = await this.getRandomEnemyAction(activeCharacter)
                var target: fight_stats = this.player
            }

            this.applyAction(action, activeCharacter, target)

            this.updateStats()

            this.activeInitiative += 1
            if(this.activeInitiative == this.initiativeList.length){
                this.activeInitiative = 0;
            }
        }
        return this.player
    }


    //TODO: Change that to actually get player input instead of random attack
    private async getPlayerAction(): Promise<ability> {
        return this.player.active_abilities[getRandomNumber(0, this.player.active_abilities.length-1)]
    }
    
    private async getRandomEnemyAction(enemyCharacter: fight_stats): Promise<ability> {
        return enemyCharacter.active_abilities[getRandomNumber(0, enemyCharacter.active_abilities.length-1)]
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

    private updateStats(){
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