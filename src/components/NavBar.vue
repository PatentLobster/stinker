<template>
 <!-- Static sidebar for desktop -->
    <div class="flex flex-shrink-0">
      <div class="flex flex-col w-20">
        <div class="flex flex-col h-0 flex-1 overflow-y-auto bg-indigo-600">
          <div class="flex-1 flex flex-col">
            <div class="flex-shrink-0 bg-indigo-700 py-4 flex items-center justify-center">
              <img class="h-8 w-auto" src="https://cdn.brainpop.com/assets/he/images/correct_state_moby_head.svg" alt="Workflow" />
            </div>
            <nav aria-label="Sidebar" class="py-6 flex flex-col items-center space-y-3">
              <router-link v-for="item in navigation" :key="item.name" :to="item.href" exact-active-class="bg-indigo-800 hover:bg-indigo-800" class="flex items-center p-4 rounded-lg text-indigo-200 hover:bg-indigo-700">
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
                    class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black bg-white ring-opacity-5">
                              <div class="relative grid grid-cols-1 gap-8 bg-white">
<!--                                <div-->
<!--                                    class="flex self-center justify-center bg-white flex-shrink-0 w-10 h-10 xl:text-gray-800 sm:h-12 sm:w-12"-->
<!--                                >-->
                                <div class="ml-3 mr-3 p-3 overflow-guard">
                                  <p class="inline">Email {{ user.email }}</p>
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
<!--          </div>-->
        </div>
      </div>
    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { Dialog, DialogOverlay, Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { CodeIcon, TerminalIcon, HomeIcon, InboxIcon, MenuIcon, CogIcon, XIcon } from '@heroicons/vue/outline'
import { useStore } from 'vuex'
const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'About', href: '/about', icon: TerminalIcon },
  { name: 'Snippets', href: '/snippets', icon: CodeIcon },
  { name: 'Messages', href: '/d', icon: InboxIcon },
  { name: 'Profile', href: '/preferences', icon: CogIcon },
]

export default {
  name: 'NavBar',
  components: {
    Dialog,
    DialogOverlay,
    MenuIcon,
    XIcon,
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