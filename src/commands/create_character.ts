#!/usr/bin/env node

import Enquirer from "enquirer"
import { create_character_class } from "../content/classes"
import { characterClass, characterClassName } from "../types"
import { CharacterSheet } from "../utils/characterFileManager"

export default async function create_character() {
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
    const all_character_names = (await CharacterSheet.getAllLoadedChars()).map(char => char.name)
    if(all_character_names.includes(answers.name)) {
        console.log("Character Name exists already, please try again with a different name.")
        return
    }
    console.time("Creating Character")
    const new_class: characterClass = await create_character_class(answers.class)
    await CharacterSheet.createNewCharacter(answers.name, new_class)
    console.timeEnd("Creating Character")
}