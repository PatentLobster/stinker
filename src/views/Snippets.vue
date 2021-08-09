<template>
  <div>
    <div class=" divide-y" v-if="snippets_count > 0">
      <div class="sr-only">
        You got: {{snippets_count}} snippets.
      </div>
      <div
          class="grid grid-cols-1 gap-6 overflow-visible"
          v-for="(snippet, i)  in snippets"
          :key="i"
      >
        <div
            class="grid-cols-1 flex justify-center"
        >
          <CodeBlock>
            {{snippet.code}}
          </CodeBlock>
          <div class="relative ml-auto mr-2 mt-3 overflow-visible">
            <button
                @click="delete_snippet(snippet)"
                type="button"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon
                  class="mr-2 -ml-0.5 h-4 w-4"
                  aria-hidden="true" /> Delete
            </button>

              <span class="relative flex py-2 shadow-sm rounded-md overflow-visible">
                <button
                    type="button"
                    @click="execute_snippet(snippet.code)"
                    class="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <LightningBoltIcon
                  class="mr-2 -ml-0.5 h-4 w-4"
                  aria-hidden="true" /> Tinker
                </button>
                <Menu as="span" class="-ml-px relative block overflow-visible">
                  <MenuButton class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                    <span class="sr-only">Open options</span>
                    <ChevronDownIcon class="h-5 w-5" aria-hidden="true" />
                  </MenuButton>
                  <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <MenuItems class="origin-top-right absolute right-0 z-10  mt-2 mr-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div class="py-1">
                        <MenuItem v-for="server in servers" :key="server.name">
                          <div
                              @click="execute_server(snippet.code, server)"
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
          </div>

        </div>
      </div>
      </div>
    <div
        v-else
        class="flex justify-center w-full justify-self-center my-3"
    >
      <div
          class="grid text-center justify-center w-3/4 bg-white shadow drop-shadow-md rounded-2xl border border-blue"
      >
        <h1
            class="align-middle block my-2 text-lg font-bold"
        >
          Wow, such empty.
        </h1>
        <img src="@/assets/doge.png"
             alt="Doge"
             class="block h-32 w-32 my-2 justify-self-center"
        >
        <p class="leading-1 mb-3">
          Stinks, no snippets found.
        </p>
      </div>
    </div>

  </div>

  <Modal :is-open="isOpen"
         :is-error="isError"
         :content="output"
         :close-modal="closeModal"
  />

</template>

<script>

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon, ServerIcon } from '@heroicons/vue/solid'
import {TrashIcon, LightningBoltIcon}  from '@heroicons/vue/outline'
import { mapState } from "vuex";

import Modal from "../components/Modal";
import CodeBlock from "../components/CodeBlock";

import * as path from 'path'
const { Client } = require('@electerm/ssh2');
const { readFileSync } = require('fs');

export default {
  name: "Snippets",
  components: {
    TrashIcon,
    LightningBoltIcon,
    CodeBlock,
    Modal,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    ChevronDownIcon,
    ServerIcon
  },
  data: () => {
    return {
      isOpen: false,
      isError: false,
    }
  },
  computed: {
    ...mapState([`snippets`, `snippets_count`,`servers`, `code_path`, `code`, `output`]),
  },
  methods: {
    delete_snippet(item) {
      this.$store.dispatch('delete_snippet', item)
    },
    execute_snippet(code) {
      this.$store.dispatch('update_code', code)
      this.$router.push('/tinker')
    },

    closeModal() {
      this.isOpen = false;
      this.isError = false;
    },
    execute_server(code, server) {
      this.$store.dispatch('update_code', code)
      this.$store.commit('clear_output')
      this.isOpen = true;
      const conn = new Client();
      conn.on('ready', () => {
        console.log('Client :: ready');
        conn.exec(`rm /tmp/stinkycode`, () => {})

        conn.sftp((err, sftp) => {
          if (err) throw err;
          sftp.readdir('/tmp', (err, list) => {
            if (err) {
              console.log(err);
            }
            console.dir("/tmp : ", list);
          });
          sftp.fastPut(this.code_path, '/tmp/stinkycode', {mode: 777});
          sftp.fastPut(path.join(__static, "../public/stinker.phar"), '/tmp/stinker.phar', {mode: 777});
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
  mounted() {
    this.$nextTick(() => {
      this.$store.commit('refresh_servers')
    })
  }
}
</script>