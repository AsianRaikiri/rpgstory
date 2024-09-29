#! /usr/bin/env node

import help from "./commands/help";
import list_characters from "./commands/list_characters";
import create_character from "./commands/create_character";
import delete_character from "./commands/delete_character";
import Enquirer from "enquirer";
import {CharacterSheet} from "./utils/characterFileManager";
import path from "path";
const figlet = require("figlet");

async function create_folder(dir: string){
    const fs = require("fs");
    if(!fs.existsSync(dir)){
        await fs.mkdirSync(dir, {recursive:true});
    }
}

async function create_asset_folders(){
    var dir = path.resolve(__dirname, 'assets', 'characters');
    await create_folder(dir);
    dir = path.resolve(__dirname, 'assets', 'storage');
    await create_folder(dir);
}
function startingScreen(){
    console.log(figlet.textSync("RPG Story - First Edition"));
    console.log("This is the starting script text for this rpg game")
}

const commands: Record<string, any> = {
    "Create new Character": create_character,
    "Delete existing Character": delete_character,
    "List all existing Characters": list_characters,
    "Help": help
}

async function main(){
    startingScreen()
    console.time("Loading all Characters")
    await create_asset_folders();
    await CharacterSheet.initStorage()
    console.timeEnd("Loading all Characters")
    const enquirer = new Enquirer()
    var active_loop = true;
    while(active_loop){
        var answers: Record <string, any> = await enquirer.prompt([
            {
                type: "select",
                name: "command",
                message: "What command do you wanna use?",
                choices: Object.keys(commands)
            },]
        )
        const selectedFunction = commands[answers.command];
        if (selectedFunction) {
            await selectedFunction();
        } else {
            console.error("Invalid selection");
        }    
        console.log("\n");
        answers = await enquirer.prompt([
            {
                type: "confirm",
                name: "keep_going",
                message: "Do you wanna do something else?",
            }]
        )
        active_loop = answers.keep_going;

    }
}

main()