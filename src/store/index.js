import { createStore } from 'vuex'
import platformInfo from "../lib/platform_info";
import Store from "electron-store";
import * as path from "path";
const settings = new Store();
import db from "../lib/nosql"
const crypto = require('crypto')
const {sync} = require('execa');
import fs from 'fs';

export default createStore({
        state: {
        php_path: '',
        arg_code: '',
        code: '',
        code_path: '',
        output: '',
        auto_exec: true,
        snippets: [],
        snippets_count: 0,
        env: '',
        project: '',
        project_path: '',
        dir: '',
        tinkering: false,
        active_processes: {},
        servers: [],
        server: {
          name: "",
          host: '',
          port: 22,
          username: '',
          password: '',
          pem: '',
          passphrase: '',
          project_path: ''
        },
        servers_count: 0,
        user: {
          name: '',
          email: '',
          profileImage: ''
        },
        commands: {},
        sorted_commands: [],
        ssh_env: {
            commands: [],
            env: []
        }
  },
  mutations: {
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
      },
      set_commands(state) {
          let {stdout} = sync(state.php_path, ['artisan', '--format=json' ], {cwd: state.dir})
          stdout = JSON.parse(stdout)
          state.commands = stdout.commands
          settings.set('commands', stdout.commands)
          state.sorted_commands =  stdout.commands.reduce(
          (result, comm) => {
            const i = comm.name[0].toUpperCase();
            (result[i]) ? result[i].push(comm) : result[i] = [comm];
            return {
              ...result,
            };
          },
          {}
      );
      },
      set_argv(state, payload) {
          state.arg_code = `$obj=unserialize(base64_decode('${payload}'));`;
      },
      tinker(state, payload) {
          state.tinkering = payload;
      },
      set_auto(state) {
          state.auto_exec = !state.auto_exec;
      },
      set_server(state, payload) {
          state.server = payload;
      },
      refresh_servers(state) {
          state.servers = db.get('servers').value();
      },
      increment_servers(state) {
          state.servers_count++
      },
      decrement_servers(state) {
          state.servers_count--
      },
  },
  actions:{
      add_server({commit}, payload) {
          db.get('servers')
              .push(payload)
              .write();
          commit('set_server', payload);
          commit("refresh_servers");
          commit("increment_servers");

      },
      delete_server({commit}, payload) {
          db.get('servers').remove(payload).write()
          commit("refresh_servers");
          commit("decrement_servers");
      },
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
      },
      refresh_settings({commit, state}) {
          state.php_path = settings.get("php_path");
          if (!settings.get("user")) {
              const user = platformInfo.gitUser
              settings.set('user.email', user.email)
              settings.set('user.name', user.name)
              settings.set('user.profileImage', `http://www.gravatar.com/avatar/${crypto.createHash('md5').update(user.email).digest('hex').toString()}?s=32`)
          }

          state.user = settings.get("user");
          state.dir  = settings.get("dir");
          state.snippets = db.get('snippets').value()
          state.snippets_count = db.get('count').value()

          if (state.dir && state.php_path) {
              state.project = settings.get('project')
              if (settings.get('commands')) {
                  state.commands = settings.get('commands')
              } else {
                commit('set_commands')
              }
          }
      },
      open_project({commit}, payload) {
          commit('set_dir', payload)
          commit('set_commands')
      },
      update_code({commit, state}, payload) {
          state.code_path = path.join(platformInfo.tempDirectory, 'l33tbeef')
          fs.writeFileSync(path.join(platformInfo.tempDirectory, 'l33tbeef'), payload)
          commit('set_code', payload)
      }
  },
  modules: {
  }
})
