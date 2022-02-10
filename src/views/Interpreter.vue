<template>
  <div class="h-screen max-h-min min-w-full flex max-h-fit overflow-hidden min-h-32 min-w-max	flex flex-col h-screen justify-between">
    <SplitPane class="h-full">
      <template v-slot:left>
        <Editor value="<?php
        "
                language="php-x"
                class="min-h-screen h-full"
                ref="ide"
                @change="handleChange"
        />
      </template>
      <template v-slot:right>
        <Editor v-model="sess.output" :value="sess.output" class="min-h-screen h-full" language="php-x" />
      </template>
    </SplitPane>
    <footer
        class="h-6 fixed bottom-0 min-w-full flex inline-flex justify-center
         bg-white text-black dark:bg-slate-600 dark:text-slate-50"
    >
      <span class="ml-0">
        {{sess?.connection?.type}}
      </span>

      <span class="ml-auto mr-1">
        {{sess?.connection?.name }}
      </span>
      <span class="flex h-3 w-3 my-auto ml-2 mr-auto">
          <span
              v-if="sess?.executing"
              class="animate-ping h-3 w-3 absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </span>

      <span
          @click="runStinker"
          class="rounded-md mr-0 px-2 bg-green-500 my-auto">
        run
      </span>
    </footer>
  </div>

</template>

<script setup>
import Editor from "../components/Editor.vue";
import SplitPane from "../components/SplitPane.vue";
import {reactive, ref, onMounted} from "vue";
import {connectionStore} from "../store/connection"
import {executeStinker} from "../services/stinker"
import { useRoute } from 'vue-router'
const route = useRoute()

const cStore = connectionStore()

const ide = ref(null)
const sess = reactive(
    {
      code: "",
      connection: null,
      output: null,
      executing: false
    }
);

onMounted(() => {
  console.log("mounted")
  console.log(route.params.id)
  if (route.params.id) {
    sess.connection = cStore.connections[route.params.id]
  } else {
    sess.connection = cStore.connections['default']
  }
})


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