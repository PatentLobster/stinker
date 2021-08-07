<template>
  <div class="interpreter">
      <SplitPane>
        <template v-slot:left>
          <Editor class=" min-h-screen h-full" language="php-x" theme="one-light"
                  @input="setCode"
                  ref="ide"
                  value=""
           ></Editor>
        </template>
        <template v-slot:right>
          <Editor v-model="output" :value="output" style="height: 50vh" class="min-h-screen h-full" language="php-x" theme="one-light" />
      </template>
      </SplitPane>
  </div>
    <div class="absolute flex-grow overflow-visible bottom-0 pt-3 pb-7 min-w-full h-4 bg-blue-50 border shadow shadow-lg  ">
      <div class="relative flex max-h-4 bottom-1 mt-1">
        <SwitchGroup @click="this.$store.commit('set_auto')" as="div" class="flex items-center ml-3">
          <Switch :value="auto_exec" :class="[auto_exec ? 'bg-indigo-600' : 'bg-gray-200', 'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500']">
            <span aria-hidden="true" :class="[auto_exec ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200']" />
          </Switch>
          <SwitchLabel as="span" class="ml-3">
            <span class="text-sm font-medium text-gray-900">Auto execute. </span>
          </SwitchLabel>
        </SwitchGroup>
        <span class="relative ml-auto mr-12 flex max-h-4 my-auto">
                <button
                    type="button"
                    @click="executeTinker"
                    class="r-24 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-6 font-medium border-gray-300 bg-white rounded-md rounded-r-none text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <LightningBoltIcon
                      class="relative mr-2 -ml-0.5 text-gray-500 h-4 w-4"
                      aria-hidden="true" /> Tinker
                </button>
                <Menu as="span" class="-ml-px relative block z-30 overflow-visible">
                  <MenuButton class=" relative my-auto inline-flex items-center px-2  rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                    <span class="sr-only">Open options</span>
                    <ChevronDownIcon class="h-4 w-4" aria-hidden="true" />
                  </MenuButton>
                  <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <MenuItems class="origin-bottom-right absolute -top-24 right-0 z-10  mb-2 mr-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div class="py-1">
                        <MenuItem v-for="server in servers" :key="server.name">
                          <div
                              @click="execute_server(server)"
                              class="text-center flex active text-gray-700 block px-4 py-2 text-sm"
                              :class="[`hover:bg-${server.color}-50`]"
                          >
                            <ServerIcon
                                :class="`text-${server.color}-500`"
                                class="w-4 h-4 ml-0 my-auto"/>
                            <span class="mx-auto my-auto" v-text="server.name" />
                          </div>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
                </Menu>
              </span>
        <button type="button"
                @click="saveSnippet"
                class=" mr-24 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-6 font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Save
          <SaveIcon class="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
        </button>
      </div>


  </div>
  <Notif
      :show="showNotification"
      :callback="closeNotif"
      timeout="2500"
      title="Wohoo!"
      content="Snippet saved."
  />
</template>

<script>
import { SaveIcon, LightningBoltIcon, ChevronDownIcon  } from '@heroicons/vue/outline'
import { Switch, SwitchGroup, SwitchLabel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import Editor from "../components/Editor";
import SplitPane from "../components/SplitPane";
import Notif from "../components/Notif";
import { mapState } from 'vuex';
import path from "path";
const {sync} = require('execa');
// import * as path from 'path'
const { Client } = require('@electerm/ssh2');
const { readFileSync } = require('fs');


export default {
  name: 'Tinker',
  components: {
    Editor,
    SaveIcon,
    LightningBoltIcon,
    ChevronDownIcon,
    Switch,
    SwitchGroup,
    SwitchLabel,
    SplitPane,
    Notif,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
  },
  data: () => {
    return {
      isOpen: false,
      showNotification: false
    }
  },
  computed: {
    ...mapState(['output', 'php_path', 'dir', 'code', 'arg_code', 'tinkering', 'auto_exec', 'code_path', 'servers' ]),
  },
  methods: {
    async executeTinker() {
      if (this.$store.state.php_path !== "" && this.tinkering === false) {
        this.$store.commit('clear_output')
        this.$store.state.tinkering = true;
        let {stdout} = sync(
            this.$store.state.php_path,
            [
                "stinker.phar",
                this.dir,
                "tinker",
                "--tinker_from=" + this.code_path,
                (this.arg_code !== "") ? "--sideload=" + this.arg_code : ""
            ],
            { cwd: __static}
        );
        this.$store.commit('set_output', stdout)

        this.$store.state.tinkering = false;
      } else {
        console.log("Error", "php executable not found.\r\nGo to Settings and choose an executable.");
        this.$store.state.tinkering = false;
      }
    },
    saveSnippet() {
      this.$store.dispatch('add_snippet',this.code);
      this.showNotification = true;
    },
    closeNotif() {
      this.showNotification = false;
    },
    setCode(e) {
      if (this.auto_exec)
        this.$store.commit('tinker', true);
      this.$store.dispatch('update_code', e.target.value)
      if (this.auto_exec) {
          setTimeout(() => {
            this.$store.commit('tinker', false)
            this.executeTinker()
          }, 420);
        }
    },
    execute_server(server) {
      this.$store.commit('clear_output')
      const conn = new Client();
      conn.on('ready', () => {
        console.log('Client :: ready');
        conn.exec(`rm /tmp/stinkycode`, () => {})
        conn.sftp((err, sftp) => {
          if (err) throw err;
          sftp.readdir('/tmp', (err, list) => {
            if (err) throw err;
            console.dir(list);
          });

          sftp.fastPut(this.code_path, '/tmp/stinkycode', {mode: 777});
          sftp.fastPut(path.join(__static, "stinker.phar"), '/tmp/stinker.phar', {mode: 777});
        });

        conn.exec(`php /tmp/stinker.phar ${server.project_path} tinker --tinker_from=/tmp/stinkycode`, (err, stream) => {
          if (err) this.isError = true;
          stream.on('close', (code, signal) => {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            conn.end();
          }).on('data', (data) => {
            this.$store.commit('set_output', data)
            console.log('STDOUT: ' + data);
          }).stderr.on('data', (data) => {
            this.isError = true;
            this.$store.commit('set_output', data)
            console.log('STDERR: ' + data);
          });
        });

      }).connect({
        host: server.host,
        port: 22,
        username: server.username,
        password: server.password ?? null,
        passphrase: server.passphrase ?? null,
        privateKey: (server.pem) ? readFileSync(server.pem) : null
      });


    }
  },
  mounted: function () {
         this.$nextTick(function () {
           this.$store.commit('refresh_servers')
           window.addEventListener('keyup', event => {
             if((event.altKey || event.metaKey ) && event.key === 's'){
               this.saveSnippet();
             }
           });

           if (this.code) {
              this.$refs.ide.editor.getModel().setValue(this.code);
              this.executeTinker()
           }

         });
  },

}
</script>
