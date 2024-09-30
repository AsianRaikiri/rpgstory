#! /usr/bin/env node

import { baseStats, characterFile, statBlock } from '../types';
import { CharacterSheetManager } from "../utils/characterFileManager";

export default async function edit_character(player_char: characterFile){
    console.log("\nEditing Character...\n")

    //View Stats
    var all_stats: statBlock = player_char.statBlock
    var base_stats: baseStats = player_char.statBlock.base_stats
    //Edit Statblock

    //View Abilities
    //Convert EXP into Levels and unlock Insights
    //Update Max Stats and current stats

    CharacterSheetManager.updateCharStats(player_char)
}