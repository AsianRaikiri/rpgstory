export type class_name = "Wizard" 
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

export interface achievement{
    name: string, 
    description: string,
    characterClass: class_name
}
export interface adventure_requirement{
    level?: number,
    achievements?: achievement[]
}

export interface adventure{
    name: string,
    current_save?: number,
    requirements?: adventure_requirement[]
}

export interface characterClass {
    name: class_name,
    level: number,
    description: string,
    base_abilities: ability[],
    secondary_abilities: ability[],
    tertary_abilities: ability[]
}
export interface baseStats {    
    strength: number,
    dexterity: number,
    constitution: number,
    wisdom: number, 
    intelligence: number,
    charisma: number
}
export interface characterFile {
    name: string,
    class: characterClass
    exp: number, 
    statBlock: statBlock
    current_adventure?: adventure,
    finished_adventure?: adventure[],
    achievements?: achievement[]
    active_abilities: ability[],
    dir: string
}

export interface statBlock {
    max_HP: number,
    HP: number,
    max_mana: number, 
    mana: number,
    max_stamina: number, 
    stamina: number,
    total_stat_points: number,
    base_stats: baseStats
}