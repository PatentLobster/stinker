<!--<script setup>-->
<!--// This starter template is using Vue 3 <script setup> SFCs-->
<!--// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup-->
<!--import Navbar from "./components/Navbar.vue";-->

<!--</script>-->

<!--<template>-->
<!--  <Navbar/>-->
<!--  <router-view class=""/>-->

<!--</template>-->
<!--
  This example requires Tailwind CSS v2.0+

  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
-->
<template>
  <div class="h-full flex flex-col">
    <!-- Top nav-->
    <header class="flex-shrink-0 relative h-16 bg-white text-black dark:text-slate-50 dark:bg-gray-700 flex items-center">
      <!-- Logo area -->
      <div class="absolute inset-y-0 left-0 static flex-shrink-0">
        <a href="#" class="flex items-center justify-center h-16 w-16 bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 w-20">
          <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white" alt="Workflow" />
        </a>
      </div>


      <div class="min-w-0 flex-1 right-0 pr-4  flex items-center ml-24 ">
        <div class="pr-4 flex-shrink-0 flex items-center space-x-10">
              <h1 class="text-lg font-bold" v-text="route.name ?? ''" />
        </div>
      </div>


    </header>

    <!-- Bottom section -->
    <div class="min-h-0 flex-1 flex overflow-hidden">
      <!-- Narrow sidebar-->
    <Navbar />

      <!-- Main area -->
      <main class="min-w-0 flex-1 border-t border-gray-200 dark:border-slate-700 lg:flex">
        <router-view/>
<!--        &lt;!&ndash; Primary column &ndash;&gt;-->
<!--        <section aria-labelledby="primary-heading" class="min-w-0 flex-1 h-full flex flex-col overflow-y-auto lg:order-last">-->
<!--          <h1 id="primary-heading" class="sr-only">Home</h1>-->
<!--          &lt;!&ndash; Your content &ndash;&gt;-->
<!--          llp-->
<!--        </section>-->

<!--        &lt;!&ndash; Secondary column (hidden on smaller screens) &ndash;&gt;-->
<!--        <aside class=" block flex-shrink-0 order-first">-->
<!--          <div class="h-full relative flex flex-col w-96 border-r border-gray-200 bg-gray-100 overflow-y-auto">-->
<!--            &lt;!&ndash; Your content &ndash;&gt;lplp-->
<!--          </div>-->
<!--        </aside>-->
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Dialog,
  DialogOverlay,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { ChevronDownIcon, SearchIcon } from '@heroicons/vue/solid'
import {
  CogIcon,
  BanIcon,
  BellIcon,
  FlagIcon,
  InboxIcon,
  MenuIcon,
  PencilAltIcon,
  UserCircleIcon,
  XIcon,
} from '@heroicons/vue/outline'
import Navbar from "./components/Navbar.vue"
import { useRoute } from 'vue-router'
const route = useRoute()

const user = {
  name: 'Whitney Francis',
  email: 'whitneyfrancis@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
  {
    name: 'Inboxes',
    href: '#',
    children: [
      { name: 'Technical Support', href: '#' },
      { name: 'Sales', href: '#' },
      { name: 'General', href: '#' },
    ],
  },
  { name: 'Reporting', href: '#', children: [] },
  { name: 'Settings', href: '#', children: [] },
]
const sidebarNavigation = [
  { name: 'Home', href: '/', icon: InboxIcon, current: true },
  { name: 'Settings', href: '/settings', icon: CogIcon, current: false },
  // { name: 'Customers', href: '#', icon: UserCircleIcon, current: false },
  // { name: 'Flagged', href: '#', icon: FlagIcon, current: false },
  // { name: 'Spam', href: '#', icon: BanIcon, current: false },
  // { name: 'Drafts', href: '#', icon: PencilAltIcon, current: false },
]
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Sign out', href: '#' },
]

const mobileMenuOpen = ref(false)

</script>