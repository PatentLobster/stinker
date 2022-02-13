<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div class="flex">
  <Listbox as="div" v-model="selected">
    <ListboxLabel class="block text-sm font-medium text-gray-700 dark:text-slate-200"> Run on: </ListboxLabel>
    <div class="mt-1 w-32 relative">
      <ListboxButton class="relative w-full h-8 my-auto bg-white text-black border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-auto text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        <div class="flex items-center">
          <span :aria-label="selected.online ? 'Online' : 'Offline'" :class="[selected.online ? 'bg-green-400' : 'bg-gray-200', 'flex-shrink-0 inline-block h-2 w-2 rounded-full']" />
          <span class="ml-3 block truncate">{{ selected.name }}</span>
        </div>
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <SelectorIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <ListboxOptions class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          <ListboxOption as="template" v-for="connection in s.connections" :key="connection.name" :value="connection" v-slot="{ active, selected }">
            <li :class="[active ? 'text-white bg-indigo-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9']">
              <div class="flex items-center">
                <span :class="[connection.online ? 'bg-green-400' : 'bg-gray-200', 'flex-shrink-0 inline-block h-2 w-2 rounded-full']" aria-hidden="true" />
                <span :class="[selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']">

                  {{ connection.name }}
                  <span class="sr-only"> is {{ connection.online ? 'online' : 'offline' }}</span>
                </span>
              </div>

              <span v-if="selected" :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
    <button
        :class="[selected?.name ? 'bg-green-500' : 'bg-slate-400' ]"
        class="rounded px-2 py-1 h-8 mb-0 mt-auto ml-3"
        :disabled="!(selected.name)"
        @click="$emit('execute', selected)"
    >
    execute
  </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid'
import {connectionStore} from "../store/connection";
const emit = defineEmits(['execute'])
const s = connectionStore()

const selected = ref({})

</script>