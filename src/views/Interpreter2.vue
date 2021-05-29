<template>
  <div class="interpreter">
    <div class="grid grid-cols-2 divide divide-blue-50">
    <div class="   min-h-full">
      <Editor class=" min-h-screen" language="php-x" theme="one-light" :value="code" @input="setCode" v-model="code"></Editor>
    </div>
        <div class="   min-h-full">
                  <Editor v-model="output" :value="output" style="height: 50vh" class="min-h-full" language="php-x" theme="one-light" />
    </div>
    </div>
    <div class="absolute flex-grow bottom-0 pt-3 pb-7 min-w-full h-4 bg-blue-50 border shadow shadow-lg  divide-x">
      <div class="relative flex max-h-4 bottom-1 mt-1">
        <button type="button"
                @click="saveSnippet"
                class=" ml-auto mr-36 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-6 font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Save
          <SaveIcon class="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import { SaveIcon  } from '@heroicons/vue/outline'
import Editor from "../components/Editor";
import { spawn } from "child_process";
import { mapState } from 'vuex';
export default {
  name: 'Tinker',
  components: {
    Editor,
    SaveIcon,
  },
  data: () => {
    return {
      isOpen: false,
    }
  },
  computed: {
    ...mapState(['output', 'php_path', 'dir', 'code', 'arg_code', 'tinkering' ]),
  },
  methods: {
    async executeTinker() {
      if (this.$store.state.php_path !== "" && this.tinkering === false) {
        this.$store.commit('clear_output')
        this.$store.state.tinkering = true;
        const tinker = spawn(this.$store.state.php_path, [`artisan`, "tinker"], { cwd: this.dir });
        tinker.stdout.setEncoding("utf-8");
        await tinker.stdin.write(this.arg_code);
        tinker.stdin.write(this.code);
        tinker.stdout.on("data", (data) => {
          this.$store.commit('set_output', data)
        });
        tinker.stdin.end();
        this.$store.state.tinkering = false;
      } else {
        console.log("Error", "php executable not found.\r\nGo to Settings and choose an executable.");
      }
    },
    saveSnippet() {
      this.$store.dispatch('add_snippet',this.code)
    },
    setCode(e) {
      this.$store.commit('set_code', e.target.value)
      this.executeTinker()
    },
  }
}
</script>
