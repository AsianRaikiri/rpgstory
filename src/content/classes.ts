import { characterClass, class_name } from "../types";
import  *  as ability_list from "./abilities";

const BASE_CLASSES: Record<string, characterClass> = {
    Wizard: {
    name: "Wizard",
    level: 1, 
    description: "A wizard class",
    base_abilities: [ability_list.FIREBALL],
    secondary_abilities: [ability_list.MAGIC_SHOT],
    tertary_abilities: [ability_list.EXPLOSION],
    },
    Cleric: {
        name: "Cleric",
        level: 1, 
        description: "A cleric class",
        base_abilities: [ability_list.FIREBALL],
        secondary_abilities: [ability_list.MAGIC_SHOT],
        tertary_abilities: [ability_list.EXPLOSION],
    },
    Warrior: {
        name: "Warrior",
        level: 1, 
        description: "A warrior class",
        base_abilities: [ability_list.FIREBALL],
        secondary_abilities: [ability_list.MAGIC_SHOT],
        tertary_abilities: [ability_list.EXPLOSION],
    }
}

export async function create_character_class(class_name: class_name, ): Promise<characterClass>{
    const created_class: characterClass =  BASE_CLASSES[class_name]; 
    return created_class
}
