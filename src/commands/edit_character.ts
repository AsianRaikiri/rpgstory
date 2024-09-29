#! /usr/bin/env node

import { characterFile } from "../types";
import { CharacterSheetManager } from "../utils/characterFileManager";

export default async function edit_character(player_char: characterFile){
    console.log("\nEditing Character...\n")

    //View Stats

    //Edit Statblock

    //View Abilities
    //Convert EXP into Levels and unlock Insights
    //Update Max Stats and current stats

    CharacterSheetManager.updateCharStats(player_char)
}