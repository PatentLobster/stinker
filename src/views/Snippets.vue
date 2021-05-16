<template>
  <div class="overflow-y-auto">
<!--    <h1 class="text-2xl" v-text="dbPath">-->
<!--    </h1>-->
    <div class=" divide-y">
      <div
          class="grid grid-cols-1 gap-6"
          v-for="snippet  in snippets"
          :key="snippet.id"
      >
        <div
            class="grid-cols-1 flex justify-center"
        >
          <code
              class="p-5 m-4 min-w-1/2 shadow bg-white rounded  whitespace-pre"
              v-html="snippet.code"
              :v-model="snippet.code"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script>

//import platformInfo from "../lib/platform_info";
import { mapState } from "vuex";
export default {

  name: "Snippets",
  components: {

  },
  computed: {
    ...mapState(['snippets']),
    // dbPath: () => platformInfo.lowDbPath
  },
  methods: {
  }



}
</script>

<style scoped>

</style>