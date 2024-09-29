#!/usr/bin/env node

import Enquirer from "enquirer";
import { CharacterSheet } from "../utils/characterFileManager";
import { characterFile } from "../types";

export default async function delete_character() {
    const enquirer = new Enquirer();

    var keep_deleting = true;
    while(keep_deleting) {
        const all_chars: characterFile[] = await CharacterSheet.getAllLoadedChars()
        if (!(all_chars.length > 0)){
            console.log("There are no more chars to delete")
            break;
        }
        const char_names: string[] = await all_chars.map((char: characterFile) => char.name)
        const answers: Record<string, any>  = await enquirer.prompt([
            {
                type: "select",
                name: "characterName",
                message: "What character do you want to delete?",
                choices: char_names,
            },
            {
                type: 'confirm',
                name: 'confirm',
                message: `Are you sure you want to create this Character?`
            }
            ]
        );
        await CharacterSheet.deleteCharWithFile(answers.characterName);
        const deleting_loop: Record<string, any>  = await enquirer.prompt([
            {
                type: 'confirm',
                name: 'keep_deleting',
                message: `Do you want to keep deleting more characters?`
            }
            ]
        );
        keep_deleting = deleting_loop.keep_deleting
    }
}