import * as fs from "fs/promises"
import path from "path"
import { characterFile, characterClass } from '../types';

const storage = require("node-persist")
const ASSET_JSON_STORAGE = path.resolve(__dirname, '..', 'assets', 'characters')
const STORAGE_SETTINGS = {
	dir: path.resolve(__dirname, '..', 'assets', 'storage'),
	stringify: JSON.stringify,
	parse: JSON.parse,
	encoding: 'utf8',
	logging: false,
	expiredInterval: 2 * 60 * 1000,
	forgiveParseErrors: true
}

export namespace CharacterSheet {	
    export async function readJson( fileName: string ): Promise<Object> {
        try {
            const str = await fs.readFile( path.resolve(ASSET_JSON_STORAGE, fileName ) )
            return JSON.parse( str.toString() )
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
            maxHP: 10,
            HP: 10,
			free_stat_points: 20,
            stats:{
                strength: 1,
                dexterity: 1,
                constitution: 1, 
                intelligence: 1,
                wisdom: 1,
                charisma: 1
            },
            active_abilities: characterClass.base_abilities,
            dir: `${name}-player.json`
        }
        return await makeJson(newCharacter, `${newCharacter.name}-player.json`)
    }

    export async function deleteCharWithFile( character_name: string ) {
		const character = await deleteCharFromStorage( character_name )

		if (character)
			await deleteJson(character.dir)
		else console.warn("Navi was only deleted from storage")
	}

	export async function deleteCharFromStorage(character_name: string ): Promise<characterFile | undefined> {
		const res = await storage.removeItem( character_name )
		if ( res.removed )
			return JSON.parse( res.file )
		else return undefined
	}
    export async function loadCharIntoStorage( character: characterFile ) {
		await storage.setItem( character.name, character)
	}

	export async function saveCharFromStorage( character: characterFile ) {
		await storage.setItem( character.name, character)
	}

	export async function updateCharStatsInStorage( character: characterFile ) {
		await storage.updateItem( character.name, character )
	}

	export async function getCharFromStorage( character_name: string ): Promise<characterFile> {
		initStorage()
		return await storage.getItem( character_name)
	}

	export async function getAllLoadedChars(): Promise<characterFile[]> {
		await storage.init( STORAGE_SETTINGS )
		return await storage.valuesWithKeyMatch('-player')
	}

	export async function getAllChars():Promise<Array<string>> {
		const char_names: Array<string> = [];
		const existing_chars = await fs.readdir(ASSET_JSON_STORAGE)
		existing_chars.forEach(elem =>{
			const char_name = elem.replace("-player.json", "");
			char_names.push(char_name)
		})
		return char_names
	}
	export async function initStorage(){
		await storage.init( STORAGE_SETTINGS )
		const file_names =  await fs.readdir(ASSET_JSON_STORAGE)
		file_names.forEach(async file_name => {
			const char_json: characterFile = await readJson(path.resolve(ASSET_JSON_STORAGE, file_name)) as characterFile
			await loadCharIntoStorage(char_json)
		})
	}
}