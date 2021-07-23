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
    <div class="absolute flex-grow bottom-0 pt-3 pb-7 min-w-full h-4 bg-blue-50 border shadow shadow-lg  divide-x">
      <div class="relative flex max-h-4 bottom-1 mt-1">
        <SwitchGroup @click="this.$store.commit('set_auto')" as="div" class="flex items-center ml-3">
          <Switch :value="auto_exec" :class="[auto_exec ? 'bg-indigo-600' : 'bg-gray-200', 'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500']">
            <span aria-hidden="true" :class="[auto_exec ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200']" />
          </Switch>
          <SwitchLabel as="span" class="ml-3">
            <span class="text-sm font-medium text-gray-900">Auto execute. </span>
          </SwitchLabel>
        </SwitchGroup>
        <button type="button"
                @click="executeTinker"
                class=" ml-auto mr-8 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-6 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Execute
          <LightningBoltIcon class="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
        </button>
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
import { SaveIcon, LightningBoltIcon  } from '@heroicons/vue/outline'
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'
import Editor from "../components/Editor";
import SplitPane from "../components/SplitPane";
import Notif from "../components/Notif";
import { spawn } from "child_process";
import { mapState } from 'vuex';

export default {
  name: 'Tinker',
  components: {
    Editor,
    SaveIcon,
    LightningBoltIcon,
    Switch,
    SwitchGroup,
    SwitchLabel,
    SplitPane,
    Notif
  },
  data: () => {
    return {
      isOpen: false,
      showNotification: false
    }
  },
  computed: {
    ...mapState(['output', 'php_path', 'dir', 'code', 'arg_code', 'tinkering', 'auto_exec' ]),
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
      this.$store.dispatch('add_snippet',this.code);
      this.showNotification = true;
    },
    closeNotif() {
      this.showNotification = false;
    },
    setCode(e) {
      this.$store.commit('tinker', true)
      this.$store.commit('set_code', e.target.value)
      if (this.auto_exec) {
          setTimeout(() => {
            this.$store.commit('tinker', false)
            this.executeTinker()
          }, 420);
        }

    },
  },
  mounted: function () {
         this.$nextTick(function () {

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
