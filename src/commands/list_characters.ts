#!/usr/bin/env node

import { characterFile } from "../types";
import { CharacterSheet } from "../utils/characterFileManager";


export default async function list_characters() {
    console.log("All available characters: ")
    const character_list = await CharacterSheet.getAllChars();
    character_list.forEach(async character => {
        const char_data :characterFile = await CharacterSheet.getCharFromStorage(character)
        console.log(`Character Name: ${char_data.name} ${char_data.class.name} lvl: ${char_data.class.level}`)
    })
}  