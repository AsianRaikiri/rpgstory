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
            stats:{
                strength: 2,
                dexterity: 2,
                constitution: 2, 
                intelligence: 2,
                wisdom: 2,
                charisma: 2
            },
            active_abilities: characterClass.base_abilities,
            dir: `${name}-player.json`
        }
        return await makeJson(newCharacter, `${newCharacter.name}-player.json`)
    }

    export async function deleteCharWithFile( character_name: string ) {
		const character = await deleteNaviFromStorage( character_name )

		if (character)
			await deleteJson(character.dir)
		else console.warn("Navi was only deleted from storage")
	}

	export async function deleteNaviFromStorage(character_name: string ): Promise<characterFile | undefined> {
		await storage.init(STORAGE_SETTINGS)
		const res = await storage.removeItem( character_name )
		if ( res.removed )
			return JSON.parse( res.file )
		else return undefined
	}
    export async function loadNaviIntoStorage( character: characterFile ) {
		await storage.init(STORAGE_SETTINGS)
		await storage.setItem( character.name, character)
	}

	export async function saveNaviFromStorage( character: characterFile ) {
		await storage.init( STORAGE_SETTINGS )
		await storage.setItem( character.name, character)
	}

	export async function updateNaviStatsInStorage( character: characterFile ) {
		await storage.init( STORAGE_SETTINGS )
		await storage.updateItem( character.name, character )
	}

	export async function getNaviFromStorage( character_name: string ): Promise<characterFile> {
		await storage.init( STORAGE_SETTINGS )
		return await storage.getItem( character_name)
	}

	export async function getAllLoadedNavis(): Promise<characterFile[]> {
		await storage.init( STORAGE_SETTINGS )
		return await storage.valuesWithKeyMatch('-player')
	}
}