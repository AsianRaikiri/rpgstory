#! /usr/bin/env node

import Enquirer from 'enquirer';
import { ability, baseStats, characterFile, statBlock } from '../types';
import { CharacterSheetManager } from "../utils/characterFileManager";

const commands: Record<string, Function> = {
    "Show Character Stats": showBaseStats,
    "Show all Stats": showAllStats,
    "Show all available abilities": showAbilities,


}

export function showBaseStats(player: characterFile) {
    
}

export function showAllStats(player: characterFile) {

}

export function showAbilities(player: characterFile) {

}

export default async function edit_character(player_char: characterFile){
    console.log("\nEditing Character...\n")
    const enquirer = new Enquirer()

    var answers: Record <string, any> = await enquirer.prompt([
        {
            type: "select",
            name: "command",
            message: `What do you want to look at ${player_char.name}`,
            choices: Object.keys(commands)
        }]
    )
    const selectedFunction: Function = commands[answers.command];
    if (selectedFunction) {
        await selectedFunction(player_char);
    } else {
        console.error("Invalid selection");
    }
    //View Stats

    //Edit Statblock

    //View Abilities
    //Convert EXP into Levels and unlock Insights
    //Update Max Stats and current stats

    CharacterSheetManager.updateCharStats(player_char)
}