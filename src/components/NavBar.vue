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
          <div class="flex-shrink-0 flex pb-5">
            <a href="#" class="flex-shrink-0 w-full">
              <img class="block mx-auto h-10 w-10 rounded-full" :src="user.profileImage" alt="" />
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
    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { Dialog, DialogOverlay } from '@headlessui/vue'
import { BookmarkAltIcon, FireIcon, HomeIcon, InboxIcon, MenuIcon, CogIcon, XIcon } from '@heroicons/vue/outline'
import { useStore } from 'vuex'
const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'About', href: '/about', icon: FireIcon },
  { name: 'Bookmarks', href: '/m', icon: BookmarkAltIcon },
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