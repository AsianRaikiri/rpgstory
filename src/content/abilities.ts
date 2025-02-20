import { ability } from "../types"

export const FIREBALL: ability = {
    name: "Fireball",
    description: "Feu Feu",
    cost_amount: 0,
    cost_type: "Mana",
    damage_amount: 1, 
    damage_type: "Magical"
}
export const MAGIC_SHOT: ability = {
    name: "Magic Shot",
    description: "Pew Pew",
    cost_amount: 1,
    cost_type: "Mana",
    damage_amount: 5, 
    damage_type: "Magical"
}
export const EXPLOSION: ability = {
    name: "Explosion",
    description: "Kaboom",
    cost_amount: 2,
    cost_type: "Mana",
    damage_amount: 10, 
    damage_type: "Magical"
}

export const SLASH: ability = {
    name: "Slash",
    description: "Shlash",
    cost_amount: 0,
    cost_type: "Stamina",
    damage_amount: 1, 
    damage_type: "Physical"
}
export const BASH: ability = {
    name: "Bash",
    description: "BAM!",
    cost_amount: 1,
    cost_type: "Stamina",
    damage_amount: 5, 
    damage_type: "Physical"
}
export const CLEAVE: ability = {
    name: "Cleave",
    description: "Big Slash!",
    cost_amount: 2,
    cost_type: "Mana",
    damage_amount: 10, 
    damage_type: "Physical"
}

export const LIGHT_BALL: ability = {
    name: "Light Ball",
    description: "Little Light",
    cost_amount: 0,
    cost_type: "Mana",
    damage_amount: 1, 
    damage_type: "Magical"
}
export const GREAT_STORM: ability = {
    name: "Great Storm",
    description: "Much windy!",
    cost_amount: 1,
    cost_type: "Mana",
    damage_amount: 5, 
    damage_type: "Magical"
}
export const DIVINE_INTERVENTION: ability = {
    name: "Divine Intervention",
    description: "God says: \"Let there be light!\"",
    cost_amount: 2,
    cost_type: "Health",
    damage_amount: 10, 
    damage_type: "Magical"
}

export const BITE: ability = {
    name: "Bite",
    description: "Nom Nom",
    cost_amount: 0,
    cost_type: "Stamina",
    damage_amount: 1, 
    damage_type: "Physical"
}
export const CLAW: ability = {
    name: "Claw",
    description: "Scratch",
    cost_amount: 1,
    cost_type: "Stamina",
    damage_amount: 3, 
    damage_type: "Physical"
}
export const SPLASH: ability = {
    name: "Splash",
    description: "This is useless",
    cost_amount: 0,
    cost_type: "Health",
    damage_amount: 0, 
    damage_type: "Physical"
}
