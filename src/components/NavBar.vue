<template>
    <div class="flex flex-shrink-0">
      <div class="flex flex-col w-20">
        <div class="flex flex-col h-0 flex-1 overflow-y-auto bg-gray-800">

          <div class="flex-1 flex flex-col">
            <div class="flex-shrink-0 bg-indigo-700 py-4 flex items-center  shadow justify-center">
              <h1
                  class="font-gochi text-white leading-5 max-h-full text-5xl">
                z
              </h1>
            </div>
            <nav aria-label="Sidebar" class="py-6 flex flex-col items-center space-y-3">
              <router-link v-for="item in navigation" :key="item.name" :to="item.href" exact-active-class="bg-gray-900 text-white hover:bg-gray-700" class="flex items-center p-4 rounded-lg text-gray-200 hover:bg-gray-700  text-base font-medium focus:ring-2 focus:ring-indigo-600">
                <component :is="item.icon" class="h-6 w-6" aria-hidden="true" />
                <span class="sr-only">{{ item.name }}</span>
              </router-link>
            </nav>
          </div>

          <Popover class="flex-shrink-0 flex pb-5 mx-auto">
            <PopoverButton class="block" ><img class="block mx-auto h-10 w-10 rounded-full" :src="user.profileImage" alt="" /></PopoverButton>
              <PopoverOverlay
                  class="bg-black"
                  :class='open ? "opacity-30 fixed inset-0" : "opacity-0"'
              />
              <transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="translate-y-1 opacity-0"
                  enter-to-class="translate-y-0 opacity-100"
                  leave-active-class="transition duration-150 ease-in"
                  leave-from-class="translate-y-0 opacity-100"
                  leave-to-class="translate-y-1 opacity-0"
              >

              <PopoverPanel
                        class="absolute z-10 w-screen max-w-md mt-4 transform  -translate-y-32  left-1/8 sm:px-0 lg:max-w-3xl">
                  <div
                    class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black bg-white ring-opacity-5 text-center"
                  >
                      <div class="relative  grid grid-cols-1 bg-white">
                        <div class="ml-3 mr-3 p-3 overflow-guard">
                          <p class="inline">Hey {{ user.name }}</p>
                        </div>

                        <div class="ml-3 mr-3 p-3 overflow-guard">
                          <p class="inline">This is a useless menu 💩</p>
                        </div>
                      </div>
                </div>
              </PopoverPanel>
              </transition>
            </Popover>
            <a href="#" class="flex-shrink-0 w-full">

              <div class="sr-only">
                <p>
                  {{ user.name }}
                </p>
                <p>
                  Account settings
                </p>
              </div>
            </a>
        </div>
      </div>
    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { Dialog, DialogOverlay, Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { CodeIcon, TerminalIcon, ServerIcon, HomeIcon, MenuIcon, CogIcon, SparklesIcon, XIcon } from '@heroicons/vue/outline'
import { useStore } from 'vuex'
const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Tinker', href: '/Tinker', icon: SparklesIcon },
  { name: 'Snippets', href: '/snippets', icon: CodeIcon },
  { name: 'Tools', href: '/commands', icon: TerminalIcon },
  { name: 'Servers', href: '/servers', icon: ServerIcon },
  { name: 'Profile', href: '/preferences', icon: CogIcon },
]

export default {
  name: 'NavBar',
  components: {
    Dialog,
    DialogOverlay,
    MenuIcon,
    XIcon,
    SparklesIcon,
    Popover,
    PopoverButton,
    PopoverPanel
  },
  setup() {
    const mobileMenuOpen = ref(false)
    const store = useStore()
    return {
      user: computed(() => store.state.user),
      navigation,
      mobileMenuOpen,
    }
  },
}
</script>