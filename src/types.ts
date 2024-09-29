export type characterClassName = "Wizard" 
    | "Cleric"
    | "Warrior"

export type cost_type = "Mana"
    | "Stamina"
    | "Health"
    | "None"

export type damage_type = "Physical"
    | "Magical"
    | "Healing"

export interface ability {
    name: string,
    description: string,
    cost_type: cost_type,
    cost_amount: number,
    damage_type: damage_type, 
    damage_amount: number
}

export interface characterClass {
    name: characterClassName,
    level: number,
    description: string,
    base_abilities: ability[],
    secondary_abilities: ability[],
    tertary_abilities: ability[]
}

export interface characterFile {
    name: string,
    class: characterClass
    exp: number, 
    maxHP: number,
    HP: number,
    stats: {
        strength: number,
        dexterity: number,
        constitution: number,
        wisdom: number, 
        intelligence: number,
        charisma: number
    }
    active_abilities: ability[],
    dir: string
}