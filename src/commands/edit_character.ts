#! /usr/bin/env node

import Enquirer from 'enquirer';
import { ability, baseStats, characterFile, statBlock } from '../types';
import { CharacterSheetManager } from "../utils/characterFileManager";
import { PlayerUI } from '../utils/ui';


const UI = new PlayerUI()
const commands: Record<string, Function> = {
    "Show Character Stats": showStatblock,
    "Show all Stats": showAllStats,
    "Show all available abilities": showAbilities,
}

export function showStatblock(player: characterFile) {
    UI.resetScreen()
    console.log(UI.getPlayerBaseStats(player))
}

export function showAllStats(player: characterFile) {
    UI.resetScreen()
    console.log(UI.getPlayerAllStats(player))
}

export function showAbilities(player: characterFile) {
    UI.resetScreen()
    console.log(UI.getAbilities(player))
}

export default async function edit_character(player_char: characterFile){
    const enquirer = new Enquirer()
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

        console.log("\n");
        answers = await enquirer.prompt([
            {
                type: "confirm",
                name: "keep_going",
                message: `Do you want to do anything else ${player_char.name}?`,
            }]
        )
        keep_editing = answers.keep_going;
    }
}