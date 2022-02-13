<template>
  <div class="flex h-full justify-center mx-auto flex-grow dark:bg-slate-900 dark:text-white">

    <div class="flex  flex-col ml-2 border-r pr-2  divide-y divide-dashed py-1 divide-gray-400 dark:divide-slate-300 dark:border-slate-400 shadow">
      <span class="my-2 mx-1"> Connections: </span>
      <div v-for="c in cStore.connections"
           class="py-2"
           @click="setConnection(c)"
      >
        <span class="rounded-md flex justify-center" :class="c.colorClass"  v-text="c.name ?? 'default'"/>
      </div>

    </div>
      <div class="container bg-white min-h-2/3 mb-3 overflow-scroll dark:bg-slate-800 dark:border-slate-700 border-solid border shadow sm:rounded-lg max-w-xl m-2 px-4 py-5 sm:p-6 mx-auto ">
        <h3 class="text-lg text-center leading-6 mx-auto font-medium dark:text-white text-gray-900">
          Create a new connection
        </h3>
        <div
            class="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 flex focus-within:ring-indigo-600 focus-within:border-indigo-600 m-2 dark:border-slate-500 dark:focus-within:ring-slate-400 dark:focus-within:border-slate-400">
          <label class="block text-sm my-auto font-medium text-gray-900 mr-auto dark:bg-slate-800 dark:text-gray-300">
            Type:
          </label>
          <span class="relative z-0 inline-flex shadow-sm rounded-md">
          <button
              type="button"
              value="local"
              @click="formInput.type = 'local'"
              class="relative inline-flex items-center px-4 py-2 rounded-l-md border focus:z-10 focus:outline-none focus:ring-1 text-sm font-medium
               border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500
               dark:border-slate-500 dark:bg-slate-700 dark:text-slate-300 hover:bg-gray-800"
              :class="[formInput.type === 'local' ? 'bg-blue-500 dark:bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-600' : '']"
          >
            Local
          </button>
          <button
              type="button"
              value="docker"
              @click="formInput.type = 'docker'"
              class="-ml-px relative inline-flex items-center px-4 py-2 border focus:z-10 focus:outline-none focus:ring-1 text-sm font-medium
               border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500
               dark:border-slate-500 dark:bg-slate-700 dark:text-slate-300 hover:bg-gray-800"
              :class="[formInput.type === 'docker' ? 'bg-blue-500 dark:bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-600' : '']"
          >
            Docker
          </button>
          <button
              type="button"
              value="ssh"
              @click="formInput.type = 'ssh'"
              class="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border focus:z-10 focus:outline-none focus:ring-1 text-sm font-medium
               border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500
               dark:border-slate-500 dark:bg-slate-700 dark:text-slate-300 hover:bg-gray-800"
              :class="[formInput.type === 'ssh' ? 'bg-blue-500 dark:bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-600' : '']"
          >
            SSH
          </button>
        </span>
        </div>
        <TextInput v-model="formInput.name" labelText="Name" placeholder="Stinky-node" id="name"/>

        <TextInput v-model="formInput.appPath" labelText="App Path" placeholder="/root" id="appPath" directory :directory="false" :button="formInput.type === 'local' ? 'file' : ''"/>

        <TextInput v-model="formInput.phpPath" labelText="PHP Path" :placeholder="formInput.type === 'local' ? 'Click the button to autodetect' : 'No autodetect for you, go type 🙃'" id="phpPath" :button="formInput.type === 'local' ? 'php' : ''"/>

        <TextInput v-model="formInput.stinkerPhar" labelText="Stinker path" placeholder="path to Stinker.phar" id="stinkerPhar" :directory="false" :button="formInput.type === 'local' ? 'file' : ''"/>
        <div
            class="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 flex focus-within:ring-indigo-600 focus-within:border-indigo-600 m-2 dark:border-slate-500 dark:focus-within:ring-slate-400 dark:focus-within:border-slate-400">
          <label class="block text-sm my-auto font-medium text-gray-900 mr-auto dark:bg-slate-800 dark:text-gray-300">
            Color:
          </label>
             <button
                 v-for="color in colorClasses"
                 :class="[color, {'animate-pulse': color === formInput.colorClass}]"
                 @click="formInput.colorClass = color"
                 class="w-6 h-6 rounded-full inline-block first:ml-auto mx-2 last:mr-auto my-0.5"
                 v-text="`&nbsp;`"
             />
        </div>


        <Listbox as="div"  v-if="formInput.type === 'docker'" v-model="selected">
          <ListboxLabel class="block text-sm font-medium text-gray-700 dark:text-slate-100 overflow-visible"> Container </ListboxLabel>
          <div class="mt-1 relative">
            <ListboxButton
                class="relative w-full  border  rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none sm:text-sm
            focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 bg-white
            dark:bg-slate-500 dark:text-whie"
            >
              <div class="flex items-center">
                <span :aria-label="selected.online ? 'Online' : 'Offline'" :class="[selected.online ? 'bg-green-400' : 'bg-gray-200', 'flex-shrink-0 inline-block h-2 w-2 rounded-full']" />
                <span class="ml-3 block truncate text-black dark:text-slate-50">{{ selected.name }}</span>
              </div>
              <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <SelectorIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
            </ListboxButton>

            <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
              <ListboxOptions class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm max-h-32 overflow-auto">
                <ListboxOption as="template" v-for="conn in data.envOptions" :key="conn.id" :value="conn" v-slot="{ active, selected }" :disabled="conn?.disabled">
                  <li :class="[active ? 'text-white bg-indigo-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9']">
                    <div class="flex items-center">
                      <span :class="[conn.online ? 'bg-green-400' : 'bg-gray-200', 'flex-shrink-0 inline-block h-2 w-2 rounded-full']" aria-hidden="true" />
                      <span :class="[selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']">
                  {{ conn.name }}
                  <span class="sr-only"> is {{ conn.online ? 'online' : 'offline' }}</span>
                </span>
                    </div>

                    <span v-if="selected" :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
        <div v-if="formInput.type === 'ssh'">
          <TextInput v-model="formInput.host" labelText="Host" placeholder="1.3.3.7" id="host"/>
          <TextInput v-model="formInput.username" labelText="Username" placeholder="user" id="username"/>
          <TextInput v-model="formInput.password" labelText="password" placeholder="Leave empty if using PEM" id="password"/>
          <TextInput v-model="formInput.passphrase" labelText="passphrase" placeholder="If using PEM" id="passphrase"/>
        </div>
        <div class="flex inline">
          <router-link
              class="ml-auto mr-1 mt-3 inline-flex items-center
             px-3 py-1.5 border border-transparent text-xs font-medium
             rounded-full shadow-sm text-white bg-green-600
             hover:bg-green-700 focus:outline-none
             focus:ring-2
             focus:ring-offset-2
             focus:ring-green-500"
              :to="`/interpreter/${formInput.name}`">Connect</router-link>
          <button
              type="button"
              @click="cStore.save_connection(formInput.name, formInput)"
              class="ml-1 mr-0 mt-3 inline-flex items-center
             px-3 py-1.5 border border-transparent text-xs font-medium
             rounded-full shadow-sm text-white bg-indigo-600
             hover:bg-indigo-700 focus:outline-none
             focus:ring-2
             focus:ring-offset-2
             focus:ring-indigo-500"
          >
            Save
          </button>
        </div>

        </div>
      </div>
</template>

<script setup>
import {ref, reactive, onMounted, watchEffect} from "vue"
import {useRouter} from "vue-router"
import {listDockerContainers} from "../lib/helpers"
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid'
import TextInput from "../components/TextInput.vue"

import {connectionStore} from "../store/connection"
const cStore = connectionStore()
const router = useRouter()
const formInput = reactive({
  name: "",
  phpPath: "",
  appPath: "",
  stinkerPhar: "",
  colorClass: "",
  icon: "",
  iconClass: "",
  type: "local",
})

const colorClasses = [
  "bg-gray-300",
  "bg-yellow-300",
  "bg-green-300",
  "bg-cyan-300",
  "bg-blue-300",
  "bg-indigo-300",
  "bg-pink-300",
  "bg-red-300",
]

const connection = ref("default")

const data = reactive({
  dockers: null,
  envOptions: [
          {id: 0, type: "local", name: "select a docker", online: false},

  ]
})
const selected = ref(data.envOptions[0])

watchEffect(() => {
  switch (selected?.value?.type) {
    case "local":
      formInput.docker = null;
      break
    case "docker":
      formInput.type = "docker"
      formInput.docker = selected.value
  }
})
const dockerPs = () => {
  listDockerContainers().then(e => {
    for (const docker of e ) {
      console.log(docker)
      data.envOptions.push({ id: docker["CONTAINER ID"], type: "docker", name: docker["NAMES"], online: true })
    }
  })
}

onMounted(() => {
  dockerPs()
})

const setConnection = (e) => {
  if (e.name === formInput.name) {
      router.push({path: `/interpreter/${formInput.name}`})
  }
  for (const [key, val] of Object.entries(e)) {
    formInput[key] = val
  }

}

</script>
