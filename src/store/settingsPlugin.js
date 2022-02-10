import {readSettings, updateConfig} from "../services/settings";

/**
 * Simple plugin to persist settings.
 * @param context
 * @returns {Promise<void>}
 * @constructor
 */
export async function SettingsPlugin(context) {
    // Saves settings to file on actions starting with set&save
    context.store.$onAction(
        ({ name, store, after }) => {
            if (name.includes("set") || name.includes("save")) {
                after(async () => {
                    if (context.options.persisting) {
                        const settings = await readSettings()
                        for (const [key, value] of Object.entries(context.options.persisting)) {
                            if (!settings[store.$id] || store[key] !== settings[store.$id][key]) {
                                await updateConfig(store.$id, key, store[key])
                            }
                        }
                    }
                })
            }
    })

    // Loads settings from file.
    if (context.options?.persisting) {
        const store = context.store
        const storeName = store.$id
        const settings = await readSettings()
        for (const [key, value] of Object.entries(context.options.persisting)) {
            if (value) {
                if (settings[storeName] && settings[storeName][key]){
                    store[key] = settings[storeName][key]
                }
            }
        }

    }
}
