#!/usr/bin/env node

import { characterFile } from "../types";
import { CharacterSheetManager } from "../utils/characterFileManager";


export default async function list_characters() {
    console.log("All available characters: ")
    const character_list: characterFile[] = await CharacterSheetManager.getAllLoadedChars();
    character_list.forEach(async (character: characterFile) => {
        console.log(`Name: ${character.name} \n\tClass: ${character.class.name} lvl: ${character.class.level}`)
    })
}  