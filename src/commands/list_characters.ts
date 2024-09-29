#!/usr/bin/env node

import { characterFile } from "../types";
import { CharacterSheet } from "../utils/characterFileManager";


export default async function list_characters() {
    console.log("All available characters: ")
    const character_list = await CharacterSheet.getAllLoadedChars();
    character_list.forEach(async character => {
        console.log(`Name: ${character.name} \n\tClass: ${character.class.name} lvl: ${character.class.level}`)
    })
}  