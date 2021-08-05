<!-- This example requires Tailwind CSS v2.0+ -->
<template>

  <div class="text-center mx-auto mt-4">
    <ul
        v-if="servers.length > 0"
        class="mx-5 gap-4 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 w-max">
      <li
          v-for="serv in servers"
          :key="serv.id"
          class="bg-white shadow overflow-hidden w-full inline-flex px-4 py-4 sm:px-6 sm:rounded-md">

        <div class="mr-0 mr-2 my-auto">
          <ServerIcon
              :class="`text-${serv.color}-600`"
              class="mx-auto my-auto h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true" />
          </div>
        <div class=" mx-4 my-auto" >
          <h3
            class="mt-2 text-sm font-medium text-gray-900">
          {{serv.name}}
        </h3>
          <h4>
            {{serv.username}}@{{serv.host}}
          </h4>
          <span v-if="server.name === serv.name && server.is_tested"></span>
        </div>
        <div class="ml-auto my-auto">
          <button
              type="button"
              @click="testConnection(serv)"
              :class="[(server.name === serv.name && server.is_tested) ? 'bg-green-600' : '', (server.name !== serv.name) ? 'bg-indigo-600' : '', (server.name === serv.name && !server.is_tested) ? 'bg-red-600' : '']"
              class="mx-2 mb-2 flex items-center p-1 border border-transparent rounded-full shadow-sm text-white  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <CheckIcon class="h-5 w-5" aria-hidden="true" />
          </button>
          <button
              type="button"
              @click="delete_server(serv)"
              class="mx-2 mt-2 flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <TrashIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </li>

      <li class="mt-6 ">
        <button
            type="button"
            @click="open_dialog"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New remote
        </button>
      </li>

    </ul>

    <div v-else class="flex-grow bg-white shadow mx-auto overflow-hidden w-full px-4 py-4 sm:px-6 sm:rounded-md">
      <ServerIcon class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" />
      <h3  class="mt-2 text-sm font-medium text-gray-900">No servers</h3>
      <p class="mt-1 text-sm text-gray-500">
        Add remotes to stink on.
      </p>
      <div class="mt-6 ">
        <button
            type="button"
            @click="open = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New remote
        </button>
      </div>
    </div>
    <span class="sr-only"> {{servers_count}} </span>
  </div>
  <Notif

      timeout="7500"
      :show="showNotification"
      :callback="closeNotif"
      :title="notification.title"
      :content="notification.content"
  />

  <TransitionRoot as="template" :show="open">
    <Dialog as="div" static class="fixed z-10 inset-0 overflow-y-auto" @close="open = false" :open="open">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
          <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div>
              <div
                  :class="`bg-${server.color}-100`"
                  class="mx-auto flex items-center justify-center h-12 w-12 rounded-full"
              >
                <ServerIcon
                    :class="`text-${server.color}-600`"
                    class="h-6 w-6"
                    aria-hidden="true" />
              </div>
              <div class="mt-3 text-center sm:mt-5">
                <DialogTitle as="h3" class="text-lg leading-6 font-medium text-gray-900">
                  Add new connection
                </DialogTitle>
                <div class="mt-2">
                  <ul class="flex flex-row justify-center items-center">
                    <li v-for="color in colors" :key="color" class="mr-4 last:mr-0">
                      <span
                          :class="(server.color === color) ? 'border-gray-500' : '' "
                          @click="server.color = color"
                          class="block p-1 border-2 rounded-full transition ease-in duration-300 focus:outline-none  ">
                        <button
                            :class="[`bg-${color}-500`]"
                            @click="server.color = color"
                            class="block w-4 h-4 rounded-full focus:outline-none"
                        />
                      </span>
                    </li>
                  </ul>
                  <div>
                    <label for="name" class="block text-sm mx-2 font-medium text-gray-700">Name</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LightBulbIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input type="text"
                             name="name"
                             id="name"
                             v-model="server.name"
                             class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                             placeholder="Leet server" />
                    </div>
                  </div>

                  <div class="mt-4">
                    <label for="Host" class="block text-sm mx-2 font-medium text-gray-700">Host:</label>
                    <div class="flex -space-x-px">
                      <div class=" flex-1 min-w-0">
                        <label for="host" class="sr-only">Hostname</label>
                        <input
                            type="text"
                            name="host"
                            id="host"
                            v-model="server.host"
                            placeholder="itzik.co"
                            class="focus:ring-indigo-500 focus:border-indigo-500 relative block w-full rounded-none rounded-bl-md rounded-tl-md  bg-transparent focus:z-10 sm:text-sm border-gray-300"
                        />
                      </div>
                      <div class="flex-5 w-1/4 min-w-0">
                        <label for="port" class="sr-only">PORT</label>
                        <input
                            type="number"
                            name="port"
                            id="port"
                            v-model="server.port"
                            class="focus:ring-indigo-500 focus:border-indigo-500 relative block w-full rounded-none rounded-br-md rounded-tr-md bg-transparent focus:z-10 sm:text-sm border-gray-300"
                            placeholder="22"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label for="project_path" class="block text-sm mt-4 font-medium text-gray-700">Project path</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FolderIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                          type="text"
                          name="project_path"
                          id="project_path"
                          v-model="server.project_path"
                          class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          placeholder="/var/www/html"
                      />
                    </div>
                  </div>

                  <div>
                    <label for="username" class="block text-sm mt-4 font-medium text-gray-700">Username</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                          type="text"
                          name="username"
                          id="username"
                          v-model="server.username"
                          class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          placeholder="root"
                      />
                    </div>
                  </div>

                  <div>
                    <div class="flex justify-between">
                      <label for="password" class="block text-sm mt-4 font-medium text-gray-700">Password</label>
                      <span class="text-sm mt-4 text-gray-500" id="password-optional">Optional</span>
                    </div>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                          type="password"
                          name="password"
                          id="password"
                          v-model="server.password"
                          class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          placeholder="password"
                      />
                    </div>
                  </div>

                  <div>
                    <div class="flex justify-between">
                      <label for="pem" class="block text-sm mt-4 font-medium text-gray-700">SSH key</label>
                      <span class="text-sm mt-4 text-gray-500" id="pem-optional">Optional</span>
                    </div>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input type="text" name="pem" id="pem" class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md" placeholder="~/.ssh/id_rsa" />
                    </div>
                  </div>

                  <div>
                    <div class="flex justify-between">
                      <label for="passphrase" class="block text-sm mt-4 font-medium text-gray-700">Key password:</label>
                      <span class="text-sm mt-4 text-gray-500" id="passphrase-optional">Optional</span>
                    </div>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                          type="password"
                          name="passphrase"
                          id="passphrase"
                          v-model="server.passphrase"
                          class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          placeholder="key pass"
                      />
                    </div>
                  </div>


                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                  type="button"
                  @click="save_server"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
              >
                <CheckIcon class="h-5 w-5 text-white" />
                Save
              </button>
              <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm" @click="open = false" ref="cancelButtonRef">
                Cancel
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>

import {mapState} from "vuex";
import Notif from "../components/Notif";

import { PlusIcon, ServerIcon, CheckIcon, LightBulbIcon, FolderIcon, KeyIcon, UserIcon, LockClosedIcon, TrashIcon } from '@heroicons/vue/solid'
import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const { Client } = require('@electerm/ssh2');
const { readFileSync } = require('fs');

export default {
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    CheckIcon,
    PlusIcon,
    ServerIcon,
    LightBulbIcon,
    FolderIcon,
    KeyIcon,
    UserIcon,
    LockClosedIcon,
    TrashIcon,
    Notif
  },
  data: () => {
    return {
      open: false,
      showNotification: false,
      notification: {
        title: "",
        content: ""
      },
      server: {
        username: '',
        password: '',
        pem: '',
        passphrase: '',
        name: '',
        host: '',
        port: 22,
        project_path: '',
        is_tested: false,
        color: 'green'
      },
      colors: [
        'red',
        'yellow',
        'green',
        'cyan',
        'teal',
        'indigo',
        'pink',
        'purple',
        'blue',
        'gray'
      ]
    }
  },
  computed: {
        ...mapState(['servers', 'servers_count' ]),
  },
  methods: {
    open_dialog() {
      this.server = {color: 'gray'};
      this.open = true;
    },
    async save_server() {
      this.$store.dispatch('add_server', this.server)
    },
    delete_server(serv) {
      this.$store.dispatch('delete_server', serv)
    },
    async testConnection(server) {
      this.server = server;
      const conn = new Client();
      conn.on('ready', () => {
        console.log('Client :: ready');
        conn.shell((err, stream) => {
          if (err) {
            console.log("nos")
            this.connectionFailure(server)
          }
          stream.on('close', () => {
            console.log('Stream :: close');
            conn.end();
          }).on('data', (data) => {
            console.log('OUTPUT: ' + data);
          });
          stream.end('whoami\nexit\n');
          this.connectionSuccess(server)
        });
      }).on('error', () => {
        this.connectionFailure(server);
      }).on('handshake', (h) => {
        console.log(h)
      }).connect({
        host: server.host,
        port: 22,
        username: server.username,
        password: server.password ?? null,
        passphrase: server.passphrase ?? null,
        privateKey: (server.pem) ? readFileSync(server.pem) : null
      });
    },
    connectionSuccess(server) {
      server.is_tested = true;
      this.showNotification = true;
      this.notification = {
        title: `Successfully connected`,
        content: `Connection to ${server.name} is valid.`
      }
    },
    connectionFailure(server) {
      server.is_tested = false;
      this.showNotification = true;
      this.notification = {
        title: `Whoopsy`,
        content: `Connection to ${server.name} failed!`
      }
    },
    closeNotif() {
      this.showNotification = false;
    },
  },
  mounted() {
    this.$nextTick( () => {
      this.$store.commit('refresh_servers')
    } )
  }
}
</script>