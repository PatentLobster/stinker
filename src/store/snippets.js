import {defineStore} from 'pinia';
import storage from "../services/storage"

function localOnly() {
  console.warn(`local storage updated but there is no DB connection`);
}

export const useStore = defineStore('snippets', {
    state: () => {
        return {
            snippets: [],
            ready: false,
            dbError: undefined,
            dbConnectionString: ''
        };
    },
    getters: {
        all(state) {
            return state.snippets
        },
    },
    actions: {
        async initializeDbBackedStore() {
            try {
                await storage.connect();
            } catch (e) {
                this.dbError = `Failed to connect to DB: ${e}`;
                console.log(this.dbError);

                this.snippets = [];
                this.ready = false;
            }

            try {
                this.snippets = await storage.all();
                this.ready = true;
            } catch (e) {
                this.dbError = `Failure getting TODO items from DB: ${e}`;
                this.snippets = [];
                this.ready = false;
            }
        },
        setErrorState(err) {
            this.dbError = err;
        },
        setDbConnectionString(connect) {
            this.dbConnectionString = connect;
        },
        async add(code, title=null) {
            const newSnippet = await storage.create(code, title)
            this.snippets.push(newSnippet)
        },
        async remove(id) {
            if (this.ready) {
                await storage.remove(id);
            } else {
                localOnly();
            }
            this.snippets = this.snippets.filter((i) => i.id !== id);
        },
        setDbError(err) {
            this.dbError = err;
        }
    }

})