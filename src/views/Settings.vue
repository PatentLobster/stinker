<template>
    <div>
    <main class="flex-1 flex overflow-hidden">
      <div class="flex-1 flex flex-col overflow-y-auto xl:overflow-hidden">
        <div class="flex-1 flex xl:overflow-hidden">
          <div class="flex-1 max-h-screen xl:overflow-y-auto">
            <div class="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
              <h1 class="text-3xl font-extrabold text-blue-gray-900">Settings</h1>
              <div class="sm:col-span-6 mt-5">
                <h2 class="text-xl font-medium text-blue-gray-900">App Env</h2>
                <p class="mt-1 text-sm text-blue-gray-500">Core app settings.</p>
              </div>
              <div class="grid grid-cols-1 divide-y gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                  <button
                      @click="dockerPs"
                  >
                    docker
                  </button>
                {{data.dockers}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    </div>
</template>

<script setup>
  // import {useStore} from "vuex";
  // import {open} from "@tauri-apps/api/dialog"
  import {reactive} from "vue"
  import {listDockerContainers} from "../lib/helpers"
  const data = reactive({
    dockers: null
  })

  const dockerPs = () => {
    listDockerContainers().then(e => {
      data.dockers = e
    })
  }

  // const store = useStore()
  // const handleChange = (e) => {
  //
  //   open().then(file => {
  //     store.dispatch("set_setting", {key: e.target.id, value: file})
  //     console.log(store.state)
  //   })
  // }

</script>

<script>
export default {
  name: "Settings"
}
</script>