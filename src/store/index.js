import { createStore } from 'vuex'

import platformInfo from "../lib/platform_info";
import Store from "electron-store";
import * as path from "path";
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
    dir: '',
    tinkering: false,
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
          state.dir  = settings.get("dir");
      },
      set_php_path(state, payload) {
          settings.set(`php_path`, payload)
          state.php_path = payload
      },
      set_dir(state, payload) {
           const f = path.dirname(payload)
           settings.set(`dir`, f)
           state.dir = f
      },
      set_code(state, payload ) {
           state.code = payload
      },
      set_output(state, payload) {
           state.output += payload
      },
      clear_output(state) {
           state.output = ''
      }

  },
  actions:{
  },
  modules: {
  }
})
