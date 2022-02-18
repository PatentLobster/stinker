<template>
  <div
      v-if="!route.params?.id"
      class="w-full flex flex-col justify-center mx-auto justify-self-center"
  >
    <div class="rounded mx-auto mt-16 bg-slate-100 justify-center w-1/2 text-slate-900 p-4 divide-y">
      <div class="flex flex-col pb-2">
        <img src="../assets/doge.png" class="w-16 h-16 inline mx-auto p-2"/>
        <h2 class="font-bold text-lg ml-1 mb-0 mt-auto mr-auto p-2 text-left">Select a connection: </h2>
      </div>
      <div
          v-for="c in cStore.all"
          :key="c.name"
          @click="connect(c)"
      >
        <div class="mx-auto m-1 p-2">
        <router-link
            :to="`/commands/${c.name}`"
            :class="c.colorClass"
            class="rounded p-1 m-2 font-bold text-slate-100"
            v-text="c.name ?? 'default'"
        />
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="overflow-hidden">
      <div class="h-screen max-h-full overflow-guard flex">
        <aside class="order-first flex flex-col flex-shrink-0 w-64 border-r border-gray-200 dark:border-slate-700">
          <div class="px-6 pt-6 pb-4">
            <div class="flex-1 min-w-0 py-2">
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                    type="search"
                    name="search"
                    v-model="state.searchString"
                    id="search"
                    ref="search"
                    class="focus:ring-pink-500 focus:border-pink-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md dark:text-slate-900" placeholder="Search" />
              </div>
            </div>
          </div>
          <!-- Directory list -->
          <nav class="flex-1 overflow-y-scroll mb-12 flex-grow h-full" aria-label="Directory">
            <div v-for="directory in Object.keys(sorted_commands).sort()" :key="directory" class="block">
              <div class="z-10 sticky top-0 border-t border-b  px-6 py-1 text-sm font-medium text-gray-500 border-gray-200 bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200">
                <h3>{{ directory }}</h3>
              </div>
              <ul class="relative z-0 divide-y divide-gray-200 dark:divide-slate-600">
                <li v-for="command in sorted_commands[directory].sort(function(a, b) {
                   return a.name.localeCompare(b.name);
                })" :key="command.name">
                  <div
                      class="relative px-6 py-5 flex items-center space-x-3  focus-within:ring-2 focus-within:ring-inset
                      hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-800 focus-within:ring-pink-500">
                    <div class="flex-1 min-w-0">
                      <button
                          class="focus:outline-none"
                          @click="state.selected_command = command"
                      >
                        <!-- Extend touch target to entire panel -->
                        <span class="absolute inset-0" aria-hidden="true" />
                        <p class="text-sm font-medium text-gray-900 dark:text-slate-200 ">
                          {{ command.name }}
                        </p>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        <div
            class="w-full mx-3  justify-self-center mt-5 mb-16 p-5 rounded-2xl shadow drop-shadow-md border
            bg-white dark:bg-slate-800 dark:border-slate-400"
        >
          <ACommand
              :command="state.selected_command"
              v-if="state.selected_command"
              @exec="execute"
          />
        </div>
      </div>
  </div>
 </div>
  <Modal :is-open="state.isOpen"
         :is-error="state.isError"
         :content="state.output"
         :close-modal="closeModal"
  />
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {connectionStore} from "../store/connection";
import {computed, onMounted, reactive, ref} from "vue";
import {getCommands, executeCommand} from "../services/stinker";
import ACommand from "../components/ACommand.vue";
import Modal from "../components/Modal.vue";
import {SearchIcon} from "@heroicons/vue/solid";

const cStore = connectionStore()
const route  = useRoute()
const router = useRouter()
const state = reactive(
    {
      connection: null,
      searchString: '',
      selected_command: null,
      isOpen: false,
      isError: false,
      output: '',
    }
)

const commands = ref({})
// const sorted_commands = ref({})
const connect = (c) => {
  router.push({path: `/commands/${c.name}`})
  state.connection = cStore.connections[route.params.id]
  hook()
}
const hook = () => {
  if (route.params.id) {
    state.connection = cStore.connections[route.params.id]
    getCommands(cStore.connections[route.params.id]).then((e) => {
      commands.value = e
    })
  }
}
onMounted(hook)

const execute = async (e) => {
  const res = await executeCommand(e, state.connection)
  if (res?.error) {
    state.isError = true
  }
  state.isOpen = true
  state.output = res.output
}

const closeModal = () => {
  state.isOpen = false
  state.isError = false
}

const sorted_commands = computed(() => {
  // return commands.value
  const c = Object.entries(commands.value ?? {})
      return c.sort().reduce(
      (result, comm) => {
        if (state.searchString === '' || comm[1].name.toLowerCase().includes(state.searchString)) {
          const i = comm[1].name[0].toUpperCase();
          (result[i]) ? result[i].push(comm[1]) : result[i] = [comm[1]];
          return {
            ...result,
          };
        }
        return {
          ...result,
        };
      },
      {}
  )
})




</script>