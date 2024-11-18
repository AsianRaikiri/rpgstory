import { ability, statBlock, enemy_file} from "../types";
import  *  as ability_list from "./abilities";

export const BASE_ENEMIES: Record<string, enemy_file> = {
    Rat: {
        name: "Rat",
        level: 1,
        active_abilities: [ability_list.MAGIC_SHOT],
        statBlock: {
            max_HP: 1,
            HP: 1,
            max_mana: 1,
            mana: 0,
            max_stamina: 1,
            stamina: 1,
            base_stats: {
                strength: 2,
                dexterity: 2,
                constitution: 2,
                intelligence: 1,
                wisdom: 0,
                charisma: 0
            },
            total_stat_points: 0
        }
    }
}
export function create_enemy(name: string){
    const created_enemy: enemy_file = BASE_ENEMIES[name]
    return created_enemy
}