#! /usr/bin/env node

import { exit } from "../index";
import { characterFile, enemy_file } from "../types";
import { CharacterSheetManager } from "../utils/characterFileManager";
import Enquirer from "enquirer";
import edit_character from "./edit_character";
import { create_enemy } from "../content/enemies";
import { getRandomNumber } from "../utils/math";
import start_battle from "./start_battle";
import { PlayerUI } from "../utils/ui";

const commands: Record<string, any> = {
    "Edit Character Sheet": edit_character,
    "Continue an Adventure": continue_adventure,
    "Start an Adventure": start_adventure,
    "Start a random Battle": start_battle,
    "Exit": exit
}
const UI = new PlayerUI()


async function continue_adventure(player_char: characterFile){
    console.log("\nContinue Adventure...\n")
}

async function start_adventure(player_char: characterFile){
    console.log("\nStarting Adventure...\n")
}

export default async function base_game_loop(){
    const enquirer: Enquirer = new Enquirer();

    const all_chars: characterFile[] = await CharacterSheetManager.getAllLoadedChars()
    if (!(all_chars.length > 0)){
        console.log("There are no  characters to play as.\nPlease create a character first.")
        return
    }
    const char_names: string[] = await all_chars.map((char: characterFile) => char.name)
    var answers: Record<string, any>  = await enquirer.prompt([
        {
            type: "select",
            name: "characterName",
            message: "What character do you want to play as?",
            choices: char_names,
        }])
    const player_char: characterFile = await CharacterSheetManager.getCharFromStorage(answers.characterName)

    console.log(`Now playing as ${player_char.name}`)
    var keep_playing: boolean = true;

    while (keep_playing){
        UI.resetScreen()
        answers = await enquirer.prompt([
            {
                type: "select",
                name: "command",
                message: `What would you like to do ${player_char.name}?`,
                choices: Object.keys(commands)
            }]
        )
        const selectedFunction: Function = commands[answers.command];
        if (selectedFunction) {
            await selectedFunction(player_char);
        } else {
            console.error("Invalid selection");
        }    
        console.log("\n");
        answers = await enquirer.prompt([
            {
                type: "confirm",
                name: "keep_going",
                message: `Do you want to do anything else in the Main Menu ${player_char.name}?`,
            }]
        )
        keep_playing = answers.keep_going;
    }

}