<template>
  <div class="home container mx-auto px-4 sm:px-6 lg:px-8 flex my-auto justify-center mt-16">
    <div class="bg-white shadow mx-auto overflow-hidden sm:rounded-lg">
      <div class="px-8 py-8 sm:px-6 divide-y divide-dotted">
        <div>
          <h1 class="text-4xl font-bold text-center">
            Hey <span class="font-gochi"> {{user.name}}. </span>
          </h1>
        </div>
        <div class="py-4">
          <p>
            To get started make sure to select laravel project and php path in the

            <router-link
                to="/preferences"
                class="inline-flex items-center px-1 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              app preferences.
            </router-link>
          </p>
        </div>
        <div class="py-4">
          <p>
            Add
            <button
                @click="openLink"
                class="inline-flex items-center px-1 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              this helper function
            </button>
            to launch Stinker from runtime with an object you want to play with.
          </p>

          <CodeBlock>
            {{`//base64_encode(serialize($anything)); \n tinker($anything); `}}
          </CodeBlock>
        </div>

        <div class="text-center pt-4 my-auto">
          Usage: <span
            class="inline-flex items-center px-1 py-0.5 rounded-l-full rounded-r-0 text-sm font-medium bg-blue-100 text-blue-800">
              stinker://open</span>
          <span
              class="inline-flex items-center px-1 py-0.5 text-sm font-medium bg-yellow-100 text-yellow-800">
              ?
            </span>
          <span
              class="inline-flex items-center  px-1 py-0.5 rounded-r-full rounded-l-0 text-sm font-medium bg-purple-100 text-purple-800">
              {base64_string}
            </span>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
const { shell } = require('electron')
import path from 'path'
import CodeBlock from "../components/CodeBlock";
export default {
  name: 'Home',
  components: {
    CodeBlock
  },
  computed: {
      ...mapState(['user'])
  },
  methods: {
    openLink() {
      shell.openPath(path.join(__static, 'stinker.php'))
    }
  },
}
</script>
