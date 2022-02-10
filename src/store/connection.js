import { defineStore } from 'pinia'
import { whichPhp } from "../lib/helpers"
import {open} from "@tauri-apps/api/dialog"
export const connectionStore = defineStore("connection", {
        state: () => {
            return {
                connections: {
                    default: {
                        phpPath: "",
                        appPath: "",
                        stinkerPhar: "",
                        colorClass: "bg-red-400",
                        icon: "",
                        iconClass: "",
                        type: "local",
                    }
                }
            }
        },
        actions: {
            set_app_path(connection, string) {
                this.connections[connection].appPath = string
            },
            set_default_php(connection, string) {
                this.connections[connection].phpPath = string
            },
            save_connection(name, connection) {
                this.connections[name] = connection
            }
        },
        persisting: {
            "connections": true,
        }
})