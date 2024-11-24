#! /usr/bin/env node

import Enquirer from 'enquirer';
import { ability, baseStats, characterFile, statBlock } from '../types';
import { CharacterSheetManager } from "../utils/characterFileManager";
import { PlayerUI } from '../utils/ui';
import { exit } from '../index';


const UI = new PlayerUI()
const enquirer = new Enquirer()

//add Function to actually edit the character sheet 
const commands: Record<string, Function> = {
    "Show Character Stats": showStatblock,
    "Show all Stats": showAllStats,
    "Show all available abilities": showAbilities,
    "Heal Character": healCharacter,
    "Use Experience Points": levelCharacter,
    "Edit Statblock": changeBaseStats,
    "Exit": exit
}

async function showStatblock(player: characterFile) {
    UI.resetScreen()
    console.log(UI.getPlayerBaseStats(player))
    return player
}

async function showAllStats(player: characterFile) {
    UI.resetScreen()
    console.log(UI.getPlayerAllStats(player))
    return player
}

async function showAbilities(player: characterFile) {
    UI.resetScreen()
    console.log(UI.getAbilities(player))
    return player
}

async function healCharacter(player: characterFile){
    console.log("Healing Character...")
    player.statBlock.HP = player.statBlock.max_HP
    player.statBlock.mana = player.statBlock.max_mana
    player.statBlock.stamina = player.statBlock.max_stamina
    return player
}

async function levelCharacter(player: characterFile){
    var exp_cost = Math.floor(player.class.level * 1.5)
    if(player.exp < exp_cost){
        console.log("You don't have enough EXP to level your class up")
        return player
    }
    player.exp -= exp_cost
    player.class.level += 1
    switch(player.class.level){
        case 5:{
            player.class.secondary_abilities.forEach((current_ability: ability) => player.active_abilities.push(current_ability))
            break;
        }
        case 10:{
            player.class.tertary_abilities.forEach((current_ability: ability) => player.active_abilities.push(current_ability))
            break;
        }
    }
    player.statBlock.total_stat_points += 3
    player = await updateVariableStats(player)
    player = await healCharacter(player)
    return player
}

export function getFreeStats(player: characterFile){
    return player.statBlock.total_stat_points - (
            player.statBlock.base_stats.charisma + 
            player.statBlock.base_stats.constitution + 
            player.statBlock.base_stats.dexterity + 
            player.statBlock.base_stats.intelligence + 
            player.statBlock.base_stats.strength + 
            player.statBlock.base_stats.wisdom
    )
}

async function changeBaseStats(player: characterFile) {
    var keep_changing: boolean = true;
    while (keep_changing){
        UI.resetScreen()
        var answers: Record <string, any> = await enquirer.prompt([
            {
                type: "select",
                name: "chosen_stat",
                message: "Which Stat do you want to change?",
                choices: Object.keys(player.statBlock.base_stats)
            }, 
        ])
        var stat = answers.chosen_stat as keyof typeof player.statBlock.base_stats
        var free_stats = getFreeStats(player) + player.statBlock.base_stats[stat]
        console.log(`Free Stats: ${free_stats}\n>`)
        answers = await enquirer.prompt([
            {
                type: "numeral",
                name: "stat_size",
                message: `What should be the new value of the stat?`,
                float: false,
            }  
        ])
        if(answers.stat_size > free_stats || answers.stat_size < 1){
            console.log("That is an invalid amount specified")
        }else{
            player.statBlock.base_stats[stat] = answers.stat_size
            player = await updateVariableStats(player)
            UI.resetScreen()
            console.log(UI.getPlayerBaseStats(player))
        }
        console.log("\n\n\n");
        answers = await enquirer.prompt([
            {
                type: "confirm",
                name: "keep_going",
                message: `Do you want to edit anything else in your character sheet ${player.name}?`,
            }
        ])
        keep_changing = answers.keep_going;
    }
    player = await healCharacter(player)
    return player
}
async function updateVariableStats(player: characterFile){
    player.statBlock.max_HP = player.statBlock.base_stats.constitution * 10
    player.statBlock.max_mana = player.statBlock.base_stats.intelligence + (player.statBlock.base_stats.wisdom *2)
    player.statBlock.max_stamina = player.statBlock.base_stats.dexterity + player.statBlock.base_stats.strength
    return player
}

export default async function edit_character(player_char: characterFile){
    var keep_editing: boolean = true;

    while (keep_editing){
        var answers: Record <string, any> = await enquirer.prompt([
            {
                type: "select",
                name: "command",
                message: `What do you want to do ${player_char.name}`,
                choices: Object.keys(commands)
            }]
        )
        const selectedFunction: Function = commands[answers.command];
        if (selectedFunction) {
            player_char = await selectedFunction(player_char);
        } else {
            console.error("Invalid selection");
        }
        //View Stats

        //Edit Statblock

        //View Abilities
        //Convert EXP into Levels and unlock Insights
        //Update Max Stats and current stats

        CharacterSheetManager.updateCharStats(player_char)

        console.log("\n\n\n");
        answers = await enquirer.prompt([
            {
                type: "confirm",
                name: "keep_going",
                message: `Do you want to edit anything else in your character sheet ${player_char.name}?`,
            }
        ])
        keep_editing = answers.keep_going;
    }
}