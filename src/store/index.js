import { createStore } from 'vuex'

import Store from "electron-store";
const settings = new Store();

export default createStore({
  state: {
    php_path: '',
    code: '',
    output: '',
    snippets: [],
    env: '',
    project: '',
    project_path: '',
    active_processes: [],
  },
  mutations: {
    refreshSettings(state) {
      state.php_path = settings.get("php_path");
      // state.php_path = settings.get("php_path");
    }
  },
  actions: {
  },
  modules: {
  }
})
