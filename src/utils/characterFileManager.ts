import * as fs from "fs/promises"
import path from "path"
import { characterFile, characterClass } from '../types';

const storage = require("node-persist")
const ASSET_JSON_STORAGE: string = path.resolve(__dirname, '..', 'assets', 'characters')
const STORAGE_SETTINGS: Object = {
	dir: path.resolve(__dirname, '..', 'assets', 'storage'),
	stringify: JSON.stringify,
	parse: JSON.parse,
	encoding: 'utf8',
	logging: false,
	expiredInterval: 2 * 60 * 1000,
	forgiveParseErrors: true
}

export namespace CharacterSheetManager {	
    export async function readJson( fileName: string ): Promise<Object> {
        try {
            const content : Buffer = await fs.readFile( path.resolve(ASSET_JSON_STORAGE, fileName ) )
            return JSON.parse( content.toString() )
        }
        catch ( e ) {
            console.error("An error occured whilst reading the file:", e)
            return {}
        }
    }
    export async function makeJson(characterSheet: Object, fileName: string) {
        try {
			await fs.writeFile(
				path.resolve(ASSET_JSON_STORAGE, fileName),
				JSON.stringify(characterSheet), 'utf-8'
			)

			return true
		} catch ( e ) {
			console.error(e)
			return false
		}
	}       

	export async function deleteJson( filePath: string ) {
		await fs.unlink( path.resolve(ASSET_JSON_STORAGE, filePath) )
	}

    export async function createNewCharacter(name: string, characterClass: characterClass): Promise<boolean> {
        const newCharacter: characterFile = {
            name: name,
            class: characterClass,
            exp: 0,
            statBlock: {
				max_HP: 10,
				HP: 10,
				max_mana: 1,
				mana: 1,
				max_stamina: 1,
				stamina: 1,
				total_stat_points: 26,
				base_stats:{
					strength: 1,
					dexterity: 1,
					constitution: 1, 
					intelligence: 1,
					wisdom: 1,
					charisma: 1
				}
			},
            active_abilities: characterClass.base_abilities,
            dir: `${name}-player.json`
        }
		await loadCharIntoStorage(newCharacter)
		return await makeJson(newCharacter, `${newCharacter.name}-player.json`)
    }

    export async function deleteCharWithFile( character_name: string ) {
		const character: characterFile = await getCharFromStorage(character_name)
		const deleted: boolean = await deleteCharFromStorage( character )
		if (deleted)
			await deleteJson(character.dir)
		else console.warn("Character was only deleted from storage")
	}

	export async function deleteCharFromStorage(character: characterFile ): Promise<boolean> {
		const res = await storage.removeItem( `${character.name}-player` )
		return res.removed
	}
    export async function loadCharIntoStorage( character: characterFile ) {
		await storage.setItem( `${character.name}-player`, character)
	}

	export async function saveCharToFile(character: characterFile){
		await makeJson(character, character.dir)
	}

	export async function updateCharStats( character: characterFile ) {
		await storage.updateItem( `${character.name}-player`, character )
		await saveCharToFile( character)
	}

	export async function getCharFromStorage( character_name: string ): Promise<characterFile> {
		return await storage.getItem( `${character_name}-player`)
	}

	export async function getAllLoadedChars(): Promise<characterFile[]> {
		await storage.init( STORAGE_SETTINGS )
		return await storage.valuesWithKeyMatch('-player')
	}

	export async function initStorage(){
		await storage.init( STORAGE_SETTINGS )
		const file_names: string[] =  await fs.readdir(ASSET_JSON_STORAGE)
		file_names.forEach(async file_name => {
			const char_json: characterFile = await readJson(path.resolve(ASSET_JSON_STORAGE, file_name)) as characterFile
			await loadCharIntoStorage(char_json)
		})
	}
	export async function destroyStorage(){
		await storage.clear()
	}
}