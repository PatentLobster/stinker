<template>
  <div>
    <main class="flex-1 flex overflow-hidden">
      <div class="flex-1 flex flex-col overflow-y-auto xl:overflow-hidden">
        <!-- Breadcrumb -->
<!--        <nav aria-label="Breadcrumb" class="bg-white border-b border-blue-gray-200 xl:hidden">-->
<!--          <div class="max-w-3xl mx-auto py-3 px-4 flex items-start sm:px-6 lg:px-8">-->
<!--            <a href="#" class="-ml-1 inline-flex items-center space-x-3 text-sm font-medium text-blue-gray-900">-->
<!--              <ChevronLeftIcon class="h-5 w-5 text-blue-gray-400" aria-hidden="true" />-->
<!--              <span>Settings</span>-->
<!--            </a>-->
<!--          </div>-->
<!--        </nav>-->

        <div class="flex-1 flex xl:overflow-hidden">
          <div class="flex-1 max-h-screen xl:overflow-y-auto">
            <div class="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
              <h1 class="text-3xl font-extrabold text-blue-gray-900">Environment</h1>
              <div class="sm:col-span-6 mt-5">
                <h2 class="text-xl font-medium text-blue-gray-900">App</h2>
                <p class="mt-1 text-sm text-blue-gray-500">Core app settings.</p>
              </div>
               <div class="grid grid-cols-1 divide-y gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                  <div class="sm:col-span-6 py-5 ">
                    <label for="username" class="inline-block text-sm font-medium text-blue-gray-900">
                      PHP Path
                    </label>

                    <div class="mt-3 mb-4 mr-3 flex w-1/3 rounded-md shadow-sm tracking-wide " >
                      <span class="inline-flex items-center p-1 px-3 rounded-l-md border border-r-0 border-blue-gray-300 bg-blue-gray-50 text-blue-gray-500 sm:text-sm">
                                              php_path:
                                            </span>

                      <span
                          class=" text-blue  flex-1 block p-1 border-blue-gray-300 rounded-none rounded-r-lg bg-white   border-blue-gray-300 border text-base text-blue-gray-900 sm:text-sm min-w-max p-2"
                          v-text="php_path"
                      />
                    </div>
                    <label class="w-32 inline-flex flex-col items-center  bg-indigo-500 text-white rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer ">
                      <span class="p-1 text-sm">Select a file</span>
                      <input type='file' class="hidden" id="php_path"
                             @change="handleFileChange"
                      />
                    </label>

                    <button
                        @click="autodetectPHP"
                        class="inline-flex items-center px-3 ml-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      autodetect
                    </button>
                  </div>
                 <div class="sm:col-span-6 py-3">
                    <label for="dir" class="inline-block text-sm font-medium text-blue-gray-900">
                      Project Path
                    </label>

                    <div class="mt-3 mb-4 mr-3 flex w-1/3  rounded-md shadow-sm tracking-wide " >
                      <span class="inline-flex items-center p-1 px-3 rounded-l-md border border-r-0 border-blue-gray-300 bg-blue-gray-50 text-blue-gray-500 sm:text-sm">
                                              dir:
                                            </span>

                      <span
                          class="text-blue flex-1 inline-block p-1 border-blue-gray-300 rounded-none rounded-r-lg bg-white border-blue-gray-300 border text-base text-blue-gray-900 min-w-max sm:text-sm p-2"
                          v-html="dir"
                      />
                    </div>
                    <label class="w-32 inline-flex flex-col items-center  bg-indigo-500 text-white rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer ">
                      <span class="p-1 text-sm">Select a folder</span>
                      <input type='file' class="hidden" id="dir"
                             @change="handleFileChange"
                      />
                    </label>
                  </div>

                 <div class="sm:col-span-6 mt-4 py-5">
                   <button
                       @click="flushSettings"
                       class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                   >
                     Flush settings
                   </button>
                 </div>
                 </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>

import { mapState } from "vuex";
import Store from "electron-store";
const settings = new Store();
import platformInfo from "../lib/platform_info";

export default {
  name: "Preferences",
  computed: {
    ...mapState(['php_path', 'dir'])

  },
  methods: {

    handleFileChange(e) {
      console.log(e)
      this.$store.commit(`set_${e.target.id}`, e.target.files[0].path)
    },
    flushSettings() {
      settings.clear()
      this.$store.commit('refreshSettings')
    },
    autodetectPHP() {
      console.log(platformInfo.which_php)
      if (!settings.get("php_path") && platformInfo.which_php) {
        this.$store.commit('set_php_path', platformInfo.which_php)
      } else {
        alert("Couldn't find PHP binary please select it manually")
      }
    }


  },
  beforeCreate() {

  },
}
</script>

<style scoped>

</style>