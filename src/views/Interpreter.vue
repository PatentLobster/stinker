<template>
  <div class="interpreter">
    <div class="flex-grow flex-col  min-h-full">
      <Editor class="flex-col min-w-screen min-h-screen" language="php-x" theme="one-light" :value="code" @input="setCode" v-model="code"></Editor>
    </div>
    <div class="absolute flex-grow bottom-0 pt-3 pb-7 min-w-full h-4 bg-blue-50 border shadow shadow-lg  divide-x">
      <div class="relative flex max-h-4 bottom-1 mt-1">
        <button type="button"
                @click="saveSnippet"
                class=" ml-auto mr-3 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-6 font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Save
          <SaveIcon class="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
        </button>

        <button type="button"
                @click="executeTinker"
                class="mr-24 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-6 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Execute
          <LightningBoltIcon class="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
        </button>
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

import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { SaveIcon, LightningBoltIcon, XIcon  } from '@heroicons/vue/outline'
import Editor from "../components/Editor";
import { spawn } from "child_process";
import { mapState } from 'vuex';
export default {
  name: 'Tinker',
  components: {
    Editor,
    SaveIcon,
    LightningBoltIcon,
    XIcon,
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot
  },
  data: () => {
    return {
      isOpen: false,
    }
  },
  computed: {
    ...mapState(['output', 'php_path', 'dir', 'code']),

  },
  methods: {
    executeTinker() {
      if (this.$store.state.php_path !== "") {
        this.$store.commit('clear_output')
        this.isOpen = true
        const tinker = spawn(this.$store.state.php_path, [`artisan`, "tinker"], { cwd: this.dir });
        tinker.stdout.setEncoding("utf-8");
        tinker.stdin.write(this.code);
        tinker.stdout.on("data", (data) => {
          this.$store.commit('set_output', data)
          this.$store.state.tinkering = false;
        });
        tinker.stdin.end();
      } else {
        console.log("Error", "php executable not found.\r\nGo to Settings and choose an executable.");
      }
    },
    closeModal() {
      this.isOpen = false;
    },
    openModal() {
      this.isOpen = true
    },
    setCode(e) {
      this.$store.commit('set_code', e.target.value)
    },
    saveSnippet() {
      this.$store.dispatch('add_snippet',this.code)
    }
  }
}
</script>
