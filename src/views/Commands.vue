<template>
  <div>
    <div class="h-screen max-h-full overflow-guard flex" v-if="php_path && dir ">
    <aside class="order-first flex flex-col flex-shrink-0 w-64 border-r border-gray-200">
      <div class="px-6 pt-6 pb-4">
        <h2 class="text-lg font-medium text-gray-900">Commands</h2>
<!--        TODO: add search -->
<!--        <p class="mt-1 text-sm text-gray-600">-->
<!--          Search {{sorted_commands.count}} commands-->
<!--        </p>-->
<!--        <form class="mt-6 flex space-x-4" action="#">-->
<!--          <div class="flex-1 min-w-0">-->
<!--            <label for="search" class="sr-only">Search</label>-->
<!--            <div class="relative rounded-md shadow-sm">-->
<!--              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">-->
<!--                <SearchIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />-->
<!--              </div>-->
<!--              <input type="search" name="search" id="search" class="focus:ring-pink-500 focus:border-pink-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md" placeholder="Search" />-->
<!--            </div>-->
<!--          </div>-->
<!--          <button type="submit" class="inline-flex justify-center px-3.5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">-->
<!--            <FilterIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />-->
<!--            <span class="sr-only">Search</span>-->
<!--          </button>-->
<!--        </form>-->
      </div>
      <!-- Directory list -->
      <nav class="flex-1 overflow-y-scroll flex-grow h-full" aria-label="Directory">
        <div v-for="directory in Object.keys(sorted_commands)" :key="directory" class="block">
          <div class="z-10 sticky top-0 border-t border-b border-gray-200 bg-gray-50 px-6 py-1 text-sm font-medium text-gray-500">
            <h3>{{ directory }}</h3>
          </div>
          <ul class="relative z-0 divide-y divide-gray-200">
            <li v-for="command in sorted_commands[directory]" :key="command.name">
              <div class="relative px-6 py-5 flex items-center space-x-3 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-pink-500">
                <div class="flex-1 min-w-0">
                  <button
                     class="focus:outline-none"
                     @click="open_command(command)"
                  >
                    <!-- Extend touch target to entire panel -->
                    <span class="absolute inset-0" aria-hidden="true" />
                    <p class="text-sm font-medium text-gray-900">
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
        class="w-full mx-3  justify-self-center bg-white my-5 p-5 rounded-2xl shadow drop-shadow-md border"
    >
      <ACommand
          :command="selected_command"
          v-if="selected_command"
          @exec="execute"
      />
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
          Stinks, no commands found,
        </p>
        <p class="leading-1 mb-3">
          Make sure to select project & PHP executable.
        </p>
      </div>
    </div>
    <Modal :is-open="isOpen"
           :is-error="isError"
           :content="output"
           :close-modal="closeModal"
    />
  </div>
</template>

<script>

import platformInfo from "../lib/platform_info";
import { mapState } from "vuex";
import {sync} from 'execa';
import Modal from "../components/Modal";
import ACommand from "../components/ACommand";
export default {
  name: "Commands",
  components: {
    ACommand,
    Modal
  },
  data: () => {
    return {
      selected_command: null,
      isOpen: false,
      isError: false
    }
  },
  computed: {
    ...mapState(['user', 'php_path', 'dir', 'commands', 'sorted_commands', 'output']),
    pi: () => platformInfo,
  },
  methods: {
    open_command(c) {
      this.selected_command = c
    },
    execute(e) {
      this.isError = false
      this.isOpen = true
      this.$store.commit('clear_output')
      try {
        const {stdout} = sync(this.php_path, ['artisan', ...e ], {cwd: this.dir})
        this.$store.commit('set_output', stdout)
      } catch (error) {
        this.isError = true
        this.$store.commit('set_output', error.message)
      }
    },
    closeModal() {
      this.isOpen = false;
      this.isError = false;
    }
  },
  mounted() {
    if (this.php_path && this.dir)
    this.$store.commit('set_commands')
  }
}
</script>
