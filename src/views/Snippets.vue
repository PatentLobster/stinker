<template>
  <div class="overflow-y-auto">
    <div class=" divide-y" v-if="snippets.count > 0">
      <div class="sr-only">
        You got: {{snippets_count}} snippets.
      </div>
      <div
          class="grid grid-cols-1 gap-6"
          v-for="(snippet, i)  in snippets"
          :key="i"
      >
        <div
            class="grid-cols-1 flex justify-center"
        >
          <CodeBlock>
            {{snippet.code}}
          </CodeBlock>
          <div class="relative ml-auto mr-2 mt-3 ">
            <button
                @click="delete_snippet(snippet)"
                type="button"
                class="inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
              <TrashIcon
                  class="ml-2 -mr-0.5 h-4 w-4"
                  aria-hidden="true" />
            </button>

            <button
                @click="execute_snippet(snippet.code)"
                type="button"
                class="flex mt-3 items-center px-2 py-1 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Tinker
              <LightningBoltIcon
                  class="ml-2 -mr-0.5 h-4 w-4"
                  aria-hidden="true" />
            </button>
          </div>
        </div>
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
          Stinks, no snippets found.
        </p>
      </div>
    </div>

  </div>
</template>

<script>

import {TrashIcon, LightningBoltIcon}  from '@heroicons/vue/outline'
import { mapState } from "vuex";
import CodeBlock from "../components/CodeBlock";
export default {

  name: "Snippets",
  components: {
    TrashIcon,
    LightningBoltIcon,
    CodeBlock
  },
  computed: {
    ...mapState([`snippets`, `snippets_count`]),
  },
  methods: {
    delete_snippet(item) {
      this.$store.dispatch('delete_snippet', item)
    },
    execute_snippet(code) {
      this.$store.commit('set_code', code)
      this.$router.push('/tinker')
    },

  }



}
</script>

<style scoped>

</style>