import { createStore } from 'vuex'
import platformInfo from "../lib/platform_info";
import Store from "electron-store";
import * as path from "path";
const settings = new Store();
import db from "../lib/nosql"
const crypto = require('crypto')

export default createStore({
    state: {
    php_path: '',
    code: '',
    output: '',
    snippets: [],
    snippets_count: 0,
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
              settings.set('user.profileImage', `http://www.gravatar.com/avatar/${crypto.createHash('md5').update('user.email').digest("hex")}?s=32`)
          }
          state.user = settings.get("user");
          state.dir  = settings.get("dir");
          state.snippets = db.get('snippets').value()
          state.snippets_count = db.get('count').value()
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
      },
      refresh_snippets(state) {
           state.snippets = db.get('snippets').value()
      },
      increment_snippets(state) {
          state.snippets_count++
      },
      decrement_snippets(state) {
          state.snippets_count--
      }
  },
  actions:{
      add_snippet({commit}, payload) {
          db.get('snippets')
              .push({ code: payload, time:new Date()})
              .write()

          // Increment count
          db.update('count', n => n + 1)
              .write()
          commit('refresh_snippets')
          commit('increment_snippets') // 💩
      },
      delete_snippet({commit}, payload) {
          db.get('snippets').remove(payload).write()

          // Decrement count
          db.update('count', n => n - 1)
              .write()

          commit('refresh_snippets')
          commit('decrement_snippets') // Either Im stupid or vue is. 💩
      }
  },
  modules: {
  }
})
