<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <button
      type="button"
      class="inline-flex items-center px-3 mr-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      @click="open = true"
  >
    queries
  </button>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="fixed inset-0 overflow-hidden z-30" @close="open = false">
      <div class="absolute inset-0 overflow-hidden">
        <DialogOverlay class="absolute inset-0" />

        <div class="fixed inset-y-0 left-0 pl-10 max-w-full flex sm:pl-16">
          <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
            <div class="w-screen max-w-md">
              <div class="h-full flex flex-col bg-white overflow-y-scroll">
                <div class="px-4 py-6 sm:px-6">
                  <div class="flex items-start justify-between">
                    <h2 id="slide-over-heading" class="text-lg font-medium text-gray-900">Query Log</h2>
                    <div class="ml-3 h-7 flex items-center">
                      <button type="button" class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500" @click="open = false">
                        <span class="sr-only">Close panel</span>
                        <XIcon class="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
                <!-- Main -->
                <div class="text-slate-900 flex flex-col divide-y mb-3">

                  <div
                      v-for="query in queries"
                      :key="query"
                      class="mx-auto px-2 shadow-lg"
                  >
                      <div class="text-slate-400 flex">
                        <span  class="mr-auto">Duration: {{query.time}}s </span>
                        <Popover class="relative">
                          <PopoverButton
                              class="inline-flex mr-0 ml-auto items-center p-1 border border-transparent rounded-full shadow-sm text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              :class="[query.bindings.length > 0 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400']"
                              :disabled="query.bindings.length === 0"
                          ><PlusSmIcon class="h-5 w-5" aria-hidden="true" /></PopoverButton>

                          <PopoverPanel class="absolute z-10 drop-shadow-lg bg-white text-slate-900 p-3 border rounded-lg divide-y space-y-2">
                            <h4>Bindings:</h4>
                            {{query.bindings}}
                          </PopoverPanel>
                        </Popover>

                      </div>
                    <SqlBlock :code="query.query"/>

                  </div>

                </div>
              </div>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref } from 'vue'
import {
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot,
  Popover,
  PopoverButton,
  PopoverPanel
} from '@headlessui/vue'
import { XIcon } from '@heroicons/vue/outline'
import { PlusSmIcon } from '@heroicons/vue/solid'
import {defineProps} from "vue";
import SqlBlock from "./SqlBlock.vue";


const props = defineProps([
   'queries'
]);

const open = ref(false)

</script>
