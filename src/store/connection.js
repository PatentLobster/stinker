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
              for(const [key, value] of Object.entries(cons)) {
                  if (value.type === "docker") {
                      cons[key].online = isDockerActive(value.docker.id)
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