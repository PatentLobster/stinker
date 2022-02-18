import { defineStore } from 'pinia'
import md5 from "crypto-js/md5"
import { readGitUser } from "../lib/helpers"
export const userStore = defineStore('user', {
    state: () => {
        return {
            name: "",
            email: "",
        }
    },
    getters: {
        gravatar: (state) => {
            return `https://www.gravatar.com/avatar/${md5(state.email).toString()}`
        }
    },
    actions: {
        async set_git_user() {
            const user = await readGitUser()
            this.name  = user.name
            this.email = user.email
        }
    },
    persisting: {
        "name": true,
        "email": true
    }
})