import {createStore} from 'vuex'
import platformInfo from "../lib/platform_info";
import Store from "electron-store";
import {dirname, join} from "path";

import {db} from "../services/db"
import {writeFileSync} from 'fs';
import {tmpdir} from "os";
import StinkerService from "../services/StinkerService";

const Stinker = new StinkerService();
const settings = new Store();
const crypto = require('crypto')
const {sync} = require('execa');


export default createStore({
        state: {
        php_path: '',
        arg_code: '',
        code: '',
        code_path: '',
        output: '',
        auto_exec: false,
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
        },
        isError: false,
  },
  mutations: {
      set_php_path(state, payload) {
          settings.set(`php_path`, payload)
          state.php_path = payload
      },
      set_dir(state, payload) {
           const f = dirname(payload)
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
           state.isError = false
      },
      async refresh_snippets(state) {

          state.snippets = await db
              .snippets
              .orderBy('id')
              .toArray();

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
      async refresh_servers(state) {
          state.servers = await db
              .servers
              .orderBy('id')
              .toArray();
      },
      increment_servers(state) {
          state.servers_count++
      },
      decrement_servers(state) {
          state.servers_count--
      },
      set_error(state, payload) {
          state.isError = payload
      }
  },
  actions:{
      async executeLocal(context) {
          Stinker.executeLocal(context)
      },
      async executeServer(context, payload) {
        Stinker.executeServer(payload, context);
      },
      async add_server({commit}, payload) {
          await db.servers.add(payload)
          commit('set_server', payload);
          commit("refresh_servers");
          commit("increment_servers");

      },
      async delete_server({commit}, payload) {
          await db.servers.delete(payload.id)
          commit("refresh_servers");
          commit("decrement_servers");
      },
      async add_snippet({commit, state}, payload) {
          await db.snippets.add({
              code: payload,
              preload: state.arg_code
          })
          commit('refresh_snippets')
          commit('increment_snippets') // 💩
      },
      delete_snippet({commit}, payload) {
          console.log(payload)
          db.snippets.delete(payload.id)
          commit('refresh_snippets')
          commit('decrement_snippets') // Either Im stupid or vue is. 💩
      },
      async refresh_settings({commit, state}) {
          state.php_path = settings.get("php_path");
          if (!settings.get("user")) {
              const user = platformInfo.gitUser
              settings.set('user.email', user.email)
              settings.set('user.name', user.name)
              settings.set('user.profileImage', `http://www.gravatar.com/avatar/${crypto.createHash('md5').update(user.email).digest('hex').toString()}?s=32`)
          }

          state.user = settings.get("user");
          state.dir  = settings.get("dir");
          state.snippets = await db.snippets.toArray();
          state.snippets_count = await db.snippets.count()
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
          commit('set_code', payload)
          state.code_path = join(tmpdir(), 'stinkycode')
          writeFileSync(join(tmpdir(), 'stinkycode'), payload)
      },
      filter_commands({state},payload) {
          const commands = settings.get('commands');
          state.sorted_commands = commands.sort().reduce(
              (result, comm) => {
                  if (comm.name.toLowerCase().includes(payload)) {
                      const i = comm.name[0].toUpperCase();
                      (result[i]) ? result[i].push(comm) : result[i] = [comm];
                      return {
                          ...result,
                      };
                  }
                  return {
                      ...result,
                  };
              },
              {})
      },
  },
  modules: {
  }
})
