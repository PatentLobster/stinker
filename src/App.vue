<template>
  <div class="h-screen max-h-full flex bg-gray-50 overflow-hidden">

    <NavBar/>

    <div class="flex-1 min-w-0 flex flex-col overflow-hidden">
      <main class="flex-1 flex overflow-hidden">

          <section aria-labelledby="primary-heading" class="min-w-full flex-1 h-full flex flex-col  lg:order-last">
            <div class="flex items-center justify-between bg-gray-800  min-w-0">
              <div class="flex-1 py-2 min-w-full">
                <h2 class="ml-2 text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">
                  {{routeName}}
                </h2>
              </div>
            </div>
          <router-view />
          </section>
      </main>
    </div>
  </div>
</template>

<script>

import NavBar from "@/components/NavBar";
const { ipcRenderer } = require('electron')
// import { shell } from 'electron'

// const {URL} = require('URL')
import URL from 'url'
export default {
  name: 'app',
  components: {
     NavBar
  },
  computed: {
    routeName() {
      return this.$route.name
    }
  },
  mounted() {
    ipcRenderer.on('stinker_invoked', (event, arg) => {
      const e = URL.parse(arg);
      this.$store.commit('set_argv', e.query);
      this.$store.commit('set_code','$obj;');
      this.$router.push('/tinker');
    })


  }
}
</script>