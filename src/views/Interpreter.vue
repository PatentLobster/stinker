<template>
  <div class="h-screen w-full max-h-min min-w-full flex max-h-fit overflow-hidden min-h-32 min-w-max	flex flex-col h-screen justify-between">
    <SplitPane class="h-full">
      <template v-slot:left>
        <Editor value="<?php
        "
                language="php-x"
                class="min-h-screen h-full"
                ref="ide"
                @keyup.meta.enter="runStinker"
                @keyup.ctrl.enter="runStinker"
                @change="handleChange"
        />
      </template>
      <template v-slot:right>
        <Editor v-model="sess.output" :value="sess.output" class="min-h-screen h-full" language="php-x" />
      </template>
    </SplitPane>
    <footer
        class="h-6 fixed bottom-0 z-1 w-full flex inline-flex justify-center
         bg-white text-black dark:bg-slate-600 dark:text-slate-50"
    >
      <span class="ml-0">
        {{sess?.connection?.type}}
      </span>

      <div class="flex justify-center items-center ml-auto  ">
        <div
            v-if="sess?.executing"
            class="spinner-border border-dotted animate-spin inline-block w-4 h-4 border-4 rounded-full" role="status">
        </div>
      </div>
      <span class=" ml-3 mr-1">
        {{sess?.connection?.name }}

      </span>
      <span class="flex h-3 w-3 my-auto ml-2 mr-auto ">
          <span
              v-if="sess?.executing"
              class="animate-ping h-3 w-3 absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </span>
      <span
          @click="runStinker"
          class="rounded-md mr-4 z-10 px-2 bg-blue-500">
        save
      </span>

      <span
          @click="runStinker"
          class="rounded-md mr-20 z-10 px-2 bg-green-500">
        run
      </span>
    </footer>
  </div>

  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="fixed z-10 inset-0 overflow-y-auto" @close="open = false">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
          <div class="inline-block align-bottom bg-white dark:bg-slate-800 dark:text-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div>
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <div class="mt-3 text-center sm:mt-5">
                <DialogTitle as="h3" class="text-lg leading-6 font-medium text-gray-900 dark:text-slate-100"> Save snippet </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-slate-200">Name this stinky code.</p>
                  <TextInput v-model="sess.title" labelText="Name" placeholder="Stinky-node" id="name"/>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                  type="button"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  @click="saveSnippet"
              >
                Save
              </button>
              <button
                  type="button"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  @click="open = false"
                  ref="cancelButtonRef"
              >
                Cancel
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>


</template>

<script setup>
import Editor from "../components/Editor.vue";
import SplitPane from "../components/SplitPane.vue";
import {reactive, ref, onMounted, onUnmounted} from "vue";
import {connectionStore} from "../store/connection"
import {executeStinker} from "../services/stinker"
import { useRoute } from 'vue-router'
import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { CheckIcon } from '@heroicons/vue/outline'
import TextInput from "../components/TextInput.vue";
import {useStore} from "../store/snippets";


const route = useRoute()
const cStore = connectionStore()
const sStore = useStore()

const open = ref(false)
const ide = ref(null)
const sess = reactive(
    {
      code: "",
      connection: null,
      output: null,
      executing: false,
      title: ""
    }
);

onMounted(() => {
  console.log("mounted")
  console.log(route.params.id)
  document.addEventListener("keydown", listenS);
  if (route.params.id) {
    sess.connection = cStore.connections[route.params.id]
  } else {
    sess.connection = cStore.connections['default']
  }
})

onUnmounted(() => {
  document.removeEventListener("keydown", listenS);
})

const saveSnippet = async () => {
  await sStore.add(sess.code, sess.title)
  open.value = false
}

const listenS = (e) => {
  if (!((e.keyCode === 83 && e.ctrlKey )|| (e.keyCode === 83 && e.metaKey ) )) {
  document.addEventListener("keydown", listenS);
    return;
  }

  e.preventDefault();
  open.value = true
  document.addEventListener("keydown", listenS);

}
const handleChange = () => {
  sess.code = ide._value.editor.getModel().getValue();
}

const runStinker = () => {
  sess.executing = true
  executeStinker(sess.connection, sess.code)
      .then((res) => {
        console.log(res)
        sess.output = res
        sess.executing = false
      }).catch((err) => {
        sess.output = err
        sess.executing = false
  })
}

</script>

<script>
export default {
  name: "Interpreter",
}
</script>