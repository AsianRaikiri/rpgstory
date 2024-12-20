#!/usr/bin/env node

import { characterFile, enemy_file, fight_stats } from "../types"
import { CharacterSheetManager } from "../utils/characterFileManager"
import { BattleSimulacrum } from "../utils/battleSimulacrum"
import { getRandomNumber } from "../utils/math"
import Enquirer from "enquirer";
import { create_enemy } from "../content/enemies";

export default async function start_battle(playerCharacter: characterFile){
    const enquirer: Enquirer = new Enquirer();
    var keep_fighting: boolean = true;

    while (keep_fighting){
        var randomEnemies: enemy_file[] = []
        for (let i = 0; i < getRandomNumber(1,5); i++){
            randomEnemies.push(create_enemy("Rat"))
        }
        
        var playerFightingFile: fight_stats = await createPlayerFightStats(playerCharacter)
        var enemiesFightingFile: fight_stats[] = await createEnemyFightStats(randomEnemies)
        const battle = new BattleSimulacrum(playerFightingFile, enemiesFightingFile)
        var newPlayerStats: fight_stats = await battle.MainLoop()
        playerCharacter = updatePlayerStats(newPlayerStats, playerCharacter)
        CharacterSheetManager.updateCharStats(playerCharacter)
        console.log("\n");
        var answers: Record<string, any> = await enquirer.prompt([
            {
                type: "confirm",
                name: "keep_going",
                message: `Do you want to fight another encounter ${playerCharacter.name}?`,
            }]
        )
        keep_fighting = answers.keep_going;
    }
}

async function createPlayerFightStats(player: characterFile): Promise<fight_stats> {
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

async function createEnemyFightStats(enemies: enemy_file[]): Promise<fight_stats[]>{
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

function updatePlayerStats(newFightStats: fight_stats, oldStats: characterFile){
    var newStats: characterFile = oldStats
    newStats.statBlock.HP = newFightStats.HP
    newStats.statBlock.mana = newFightStats.mana
    newStats.statBlock.stamina = newFightStats.stamina
    newStats.exp = oldStats.exp + 1
    return newStats
}
