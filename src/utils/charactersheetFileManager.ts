import * as fs from "fs/promises"
import path from "path"
const storage = require("node-persist")

const STORAGE_SETTINGS = {
	dir: path.resolve(__dirname, '..', 'assets', 'characterStorage'),
	stringify: JSON.stringify,
	parse: JSON.parse,
	encoding: 'utf8',
	logging: false,
	expiredInterval: 2 * 60 * 1000,
	forgiveParseErrors: true
}
