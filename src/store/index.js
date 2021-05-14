import { createStore } from 'vuex'

import Store from "electron-store";
import platformInfo from "../lib/platform_info";
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
    user: {
      name: '',
      email: '',
      profileImage: ''
    }
  },
      mutations: {
        refreshSettings(state) {
            state.php_path = settings.get("php_path");
            if (!settings.get("user")) {
                const user = platformInfo.gitUser
                settings.set('user.email', user.email)
                settings.set('user.name', user.name)
                settings.set('user.profileImage', `http://www.gravatar.com/avatar/${user.email}?s=32`)
            }
          state.user = settings.get("user");
        }
        // state.php_path = settings.get("php_path");

    },
  actions: {

  },
  modules: {
  }
})
