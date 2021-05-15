<template>
  <div class="home ">
<!--    <Tinker />-->
    <div class="flex-grow flex-col  min-h-full">
      <Editor class="flex-col min-w-screen min-h-screen" language="php-x" theme="one-light" :value="code" @input="setCode" v-model="code"></Editor>
    </div>
    <div class="absolute flex bottom-0 p-2 pb-6 min-w-full h-4 bg-gray-500">
        <button type="button"
                @click="openModal"
                class="ml-auto mr-2  inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-6 font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Save
          <SaveIcon class="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
        </button>

      <button type="button"
              @click="executeTinker"
              class="mr-auto inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-6 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        Execute
        <LightningBoltIcon class="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
      </button>
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
              <DialogOverlay class="fixed inset-0" />
            </TransitionChild>
            <span class="inline-block h-screen align-middle" aria-hidden="true">
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
                  class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
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
                <div class="mt-2">
                  <h6>{{ output }}</h6>
                  {{kaki}}
<!--                  <code class="text-sm text-gray-500" v-text="output">-->

<!--                  </code>-->
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
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// import Tinker from "../components/Tinker";
import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { SaveIcon, LightningBoltIcon, XIcon  } from '@heroicons/vue/outline'
import Editor from "../components/Editor";
import { spawn } from "child_process";
import { mapState } from 'vuex';
// import "@/lib/tinker";
export default {
  name: 'Thinker',
  components: {
    // Tinker,
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
        // this.$store.state.tinkering = true;
        console.log(this.dir)
        console.log(this.code)
        const tinker = spawn(this.$store.state.php_path, [`artisan`, "tinker"], { cwd: this.dir });
        tinker.stdout.setEncoding("utf-8");
        // this.$store.state.output = "";
        tinker.stdout.on("data", (data) => {
          console.log(data.toString())
         // this.kaki += data.toString();
          this.$store.state.tinkering = false;
        });
        tinker.stdin.write(this.code);
        tinker.stdout.on("data", (data) => {
          console.log(data.toString())
          // this.kaki = data.toString()
          this.$store.commit('set_output', data)
         // this.kaki += data.toString();
          this.$store.state.tinkering = false;
        });
        console.log(tinker)
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
      console.log(e.target.value)
      this.$store.commit('set_code', e.target.value)
    }
  }
}
</script>
