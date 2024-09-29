#!/usr/bin/env node

import Enquirer from "enquirer"
import { create_character_class } from "../templates/classes"
import { characterClass, characterClassName } from "../types"
import { CharacterSheet } from "../utils/characterFileManager"
import path from "path"
const fs = require("fs")

function create_class_folder(){
    const dir = path.resolve(__dirname, '..', 'assets', 'characters')
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir, {recursive:true})
    }
}

export default async function create_character() {
    create_class_folder()
    const enquirer = new Enquirer();
    const answers: Record<string, any>  = await enquirer.prompt([
        {
            type: 'text',
			name: 'name',
			message: `What is the name of your new Character?`,
			result: function(value) {
				value = value.replace(/\s+/gm, '_')
				const firstLetter = value.charAt(0).toUpperCase()
				return firstLetter + value.slice(1)
            }
        },
        {
            type: "select",
            name: "class",
            message: "What class do you wanna choose?",
            choices: ["Cleric", "Warrior", "Wizard"],
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure you want to create this Character?`
        }
        ]
    )
    if (!answers.confirm) {
		console.log('Permission for Character Creation file creation denied')
		process.exit(0)
	}
    console.time("Creating Character")
    const newClass: characterClass = await create_character_class(answers.class)
    await CharacterSheet.createNewCharacter(answers.name, newClass)
    console.timeEnd("Creating Character")
}