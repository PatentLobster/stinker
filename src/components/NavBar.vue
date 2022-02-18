<template>
        <nav aria-label="Sidebar" class=" block flex-shrink-0 bg-gray-800 overflow-y-auto">
        <div class="relative w-20 flex flex-col p-3 space-y-3">
          <router-link v-for="item in sidebarNavigation" :key="item.name" :to="item.href" :class="[item.name === route.currentRoute.value.name ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-700', 'flex-shrink-0 inline-flex items-center justify-center h-14 w-14 rounded-lg']">
            <span class="sr-only">{{ item.name }}</span>
            <component :is="item.icon" class="h-6 w-6" aria-hidden="true" />
          </router-link>
<!--          <Menu as="div" class="relative z-20 text-left mx-auto mb-6 mt-auto bottom">-->
<!--            <MenuButton class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">-->
<!--              <span class="sr-only">Open user menu</span>-->
<!--              <img class="h-8 w-8 rounded-full" :src="user.imageUrl" alt="" />-->
<!--            </MenuButton>-->

<!--            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">-->
<!--              <MenuItems class="origin-bottom-right absolute z-30  mb-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">-->
<!--                <div class="py-1">-->
<!--                  <MenuItem v-slot="{ active }">-->
<!--                    <a href="#" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"> Your Profile </a>-->
<!--                  </MenuItem>-->
<!--                  <MenuItem v-slot="{ active }">-->
<!--                    <a href="#" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"> Sign Out </a>-->
<!--                  </MenuItem>-->
<!--                </div>-->
<!--              </MenuItems>-->
<!--            </transition>-->
<!--          </Menu>-->
        </div>
      </nav>
</template>


<script setup>
import {Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue'
// import {BellIcon, MenuIcon, XIcon} from '@heroicons/vue/outline'
import {PlusSmIcon} from '@heroicons/vue/solid'
import {useRouter} from 'vue-router'
import {computed, onMounted} from "vue"
import {userStore} from "../store/user"
const store = userStore()
const route = useRouter()
onMounted(() => {
    if (store.name == "") {
      store.set_git_user()
    }
})
import {
  CogIcon,
  BanIcon,
  BellIcon,
  FlagIcon,
  InboxIcon,
  MenuIcon,
  PencilAltIcon,
  TerminalIcon,
  UserCircleIcon,
  XIcon,
} from '@heroicons/vue/outline'
const navigation = computed( () => {
  return route.getRoutes().map(r => {
    return {
      name: r.name,
      href: r.path,
      current:  r.path === route.currentRoute.value.path
    }
  })
})

const user = {
  name: 'Whitney Francis',
  email: 'whitneyfrancis@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

const sidebarNavigation = [
  { name: 'Home', href: '/', icon: InboxIcon },
  // { name: 'Settings', href: '/settings', icon: CogIcon },
  { name: 'Snippets', href: '/snippets', icon: PencilAltIcon},
  { name: 'Commands', href: '/commands', icon: TerminalIcon},
]
</script>