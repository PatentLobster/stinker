import { createDir, readDir, readTextFile, writeFile } from '@tauri-apps/api/fs';
import {appDir} from "@tauri-apps/api/path";

export async function readSettings() {
    const ls = await lsAppFolder()
    if (ls.some(e => {
        return e.name === "settings.json"
    })) {
        return JSON.parse(await readTextFile(await appDir()+  '/settings.json'))
    } else {
        return {}
    }
}

export async function lsAppFolder() {
    const dir = await appDir()
    return readDir(dir)
        .catch( async err => {
            await createDir(dir)
        })
        .then(res => {
                return res;
            }
        )
}

export async function updateConfig(store, key, value) {
    const config = await readSettings()
    if (!config[store]) {
        config[store] = {
            key: value
        }
    } else {
        config[store][key] = value
    }
    await writeSettingsFile(JSON.stringify(config).toString())
    return await readSettings()
}

export async function writeSettingsFile(json) {
    await writeFile({
        path: await appDir() + "settings.json",
        contents: json
    })
}


