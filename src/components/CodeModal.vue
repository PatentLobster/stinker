<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="template"
            @close="closeModal"
    >
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="min-h-screen px-4 text-center">
          <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100"
              leave-to="opacity-0"
          >
            <DialogOverlay class="fixed min-w-screen inset-0" />
          </TransitionChild>
          <span class="inline-block h-screen  align-middle" aria-hidden="true">
            &#8203;
          </span>

          <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
          >
            <div
                class="inline-block min-w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
            >
              <div class="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                <button type="button" class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" @click="closeModal">
                  <span class="sr-only">Close</span>
                  <XIcon class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900"
              >
                Output:
              </DialogTitle>
              <div class="rounded-md bg-red-50 p-4" v-if="isError">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <img
                        class="w-12 h-12"
                        src="../assets/no.png"
                        alt="Nope">
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">
                      There were errors with your execution 🌚
                    </h3>
                    <div class="mt-2 text-sm text-red-700">
                      Something went wrong.
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-2 min-h-full">
                <Editor v-model="content" style="height: 50vh" class="min-h-full" language="php-x" theme="one-light" />
              </div>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XIcon } from '@heroicons/vue/outline'
import Editor from "./Editor.vue";
import {defineProps, toRef} from "vue";

const props = defineProps([
    'title',
    'isError',
    'content',
    'isOpen',
    'closeModal'
])

</script>