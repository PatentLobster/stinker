import { defineStore } from 'pinia'
import {isDockerActive} from "../lib/helpers";

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
        getters: {
          all(state) {
              const cons = state.connections
              for(let [key, value] of Object.entries(cons)) {
                  switch (value.type) {
                      case "docker":
                        cons[key].online = isDockerActive(value.docker.id)
                        break
                      case "ssh":
                          cons[key].online = false  // Todo
                          break
                      default:
                          cons[key].online = true
                  }
              }
              return cons;
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