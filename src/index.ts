#! /usr/bin/env node

import help from "./commands/help";
import list_characters from "./commands/list_characters";
import create_character from "./commands/create_character";
import delete_character from "./commands/delete_character";
import Enquirer from "enquirer";
const figlet = require("figlet");

function startingScreen(){
    console.log(figlet.textSync("RPG Story - First Edition"));
    console.log("This is the starting script text for this rpg game")
}

async function main(){
    startingScreen()
    const commands: Record<string, any> = {
        "Create new Character": create_character,
        "Delete existing Character": delete_character,
        "List all existing Characters": list_characters,
        "Help": help
    }
    const enquirer = new Enquirer()
    enquirer.prompt([
        {
            type: "select",
            name: "command",
            message: "What do command do you wanna use?",
            choices: Object.keys(commands)
        },]
    ).then((answers: Record<string, any>) => {
        const exampleFunction = commands[answers.command];
        if (exampleFunction) {
          exampleFunction();
        } else {
          console.error("Invalid selection");
        }    
    })
    
}

main()