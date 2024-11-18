#!/usr/bin/env node

import Enquirer from "enquirer"
import { create_character_class } from "../content/classes"
import { characterClass, characterFile, enemy_file, fight_stats } from "../types"
import { CharacterSheetManager } from "../utils/characterFileManager"
import { BattleSimulacrum } from "../utils/battleSimulacrum"

export default async function startBattle(playerCharacter: characterFile, enemies: enemy_file[]){
    var playerFightingFile: fight_stats = createPlayerFightStats(playerCharacter)
    var enemiesFightingFile: fight_stats[] =  createEnemyFightStats(enemies)
    const battle = new BattleSimulacrum(playerFightingFile, enemiesFightingFile)
    var newPlayerStats: fight_stats = await battle.MainLoop()
    playerCharacter = updatePlayerStats(newPlayerStats, playerCharacter)
    CharacterSheetManager.updateCharStats(playerCharacter)
    return
}

function createPlayerFightStats(player: characterFile): fight_stats {
    var player_fight_stats : fight_stats = {
        name: player.name,
        initiative: getRandomNumber(1,20) + player.statBlock.base_stats.dexterity,
        active_abilities: player.active_abilities,
        max_HP: player.statBlock.max_HP,
        HP: player.statBlock.HP,
        max_mana: player.statBlock.max_mana,
        mana: player.statBlock.mana,
        max_stamina: player.statBlock.max_stamina,
        stamina: player.statBlock.stamina,
        base_stats: player.statBlock.base_stats,
    }
    return player_fight_stats
}

function createEnemyFightStats(enemies: enemy_file[]): fight_stats[]{
    var final_fighters: fight_stats[] = []
    var counter : number = 0
    enemies.forEach(enemy => {
        var new_stats : fight_stats = {
            name: enemy.name + counter.toString(),
            initiative: getRandomNumber(1,20) + enemy.statBlock.base_stats.dexterity,
            active_abilities: enemy.active_abilities,
            max_HP: enemy.statBlock.max_HP,
            HP: enemy.statBlock.HP,
            max_mana: enemy.statBlock.max_mana,
            mana: enemy.statBlock.mana,
            max_stamina: enemy.statBlock.max_stamina,
            stamina: enemy.statBlock.stamina,
            base_stats: enemy.statBlock.base_stats,
        } 
        final_fighters.push(new_stats)       
        counter += 1
    });
    return final_fighters
}

export function getRandomNumber(min: number, max: number): number{
    return Math.floor(Math.random()*(max-min +1 )+ min)
}

function updatePlayerStats(newFightStats: fight_stats, oldStats: characterFile){
    var newStats: characterFile = oldStats
    newStats.statBlock.HP = newFightStats.HP
    newStats.statBlock.mana = newFightStats.mana
    newStats.statBlock.stamina = newFightStats.stamina
    newStats.exp = oldStats.exp + 1
    return newStats
}
