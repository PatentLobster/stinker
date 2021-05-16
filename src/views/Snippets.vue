<template>
  <div class="overflow-y-auto">
<!--    <h1 class="text-2xl" v-text="dbPath">-->
<!--    </h1>-->


    <div class=" divide-y">
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
          <code
              class="p-5 m-4 min-w-1/2 shadow bg-white rounded ml-auto whitespace-pre"
              v-html="snippet.code"
              :v-model="snippet.code"
          />
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

  </div>
</template>

<script>

//import platformInfo from "../lib/platform_info";
import {TrashIcon, LightningBoltIcon}  from '@heroicons/vue/outline'
import { mapState } from "vuex";
export default {

  name: "Snippets",
  components: {
    TrashIcon,
    LightningBoltIcon
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
    }
  }



}
</script>

<style scoped>

</style>