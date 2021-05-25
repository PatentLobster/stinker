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
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="template"
              @close="closeModal"
      >
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="min-h-screen px-4 text-center">
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
              <DialogOverlay class="fixed min-w-screen inset-0" />
            </TransitionChild>
            <span class="inline-block h-screen  align-middle" aria-hidden="true">
            &#8203;
          </span>

            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
            >
              <div
                  class="inline-block min-w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
              >
                <div class="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                  <button type="button" class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" @click="isOpen = false">
                    <span class="sr-only">Close</span>
                    <XIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <DialogTitle
                    as="h3"
                    class="text-lg font-medium leading-6 text-gray-900"
                >
                  Output:
                </DialogTitle>
                <div class="rounded-md bg-red-50 p-4" v-if="isError">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <img
                      class="w-12 h-12"
                      src="@/assets/no.png"
                      alt="Nope">
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-red-800">
                        There were errors with your execution 🌚
                      </h3>
                      <div class="mt-2 text-sm text-red-700">
                        Something went wrong.
                      </div>
                    </div>
                  </div>
                </div>


                <div class="mt-2 min-h-full">
                  <Editor v-model="output" :value="output" style="height: 50vh" class="min-h-full" language="php-x" theme="one-light" />
                </div>
              </div>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script>


import { XIcon } from '@heroicons/vue/outline'
import platformInfo from "../lib/platform_info";
import { mapState } from "vuex";
import {sync} from 'execa';
import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import ACommand from "../components/ACommand";
import Editor from "../components/Editor";
export default {
  name: "Commands",
  components: {
    Editor,
    ACommand,
    XIcon,
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot
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
