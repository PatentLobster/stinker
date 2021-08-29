<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="fixed z-10 inset-0 overflow-y-auto" @close="closeModal">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
          <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div>
              <div class="mt-3 text-center sm:mt-5">
                <DialogTitle as="h3" class="text-lg leading-6 font-medium text-gray-900">
                  Add a new <span
                    v-html="tagObject.name"
                    :class="[
                        tagObject.color,
                        `inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium text-gray-800`
                    ]"
                /> tag.
                </DialogTitle>
                <div class="mt-2">
                  <label for="inline-flex color py-2 mr-0">Color:</label>
                  <ul class="flex flex-row justify-center items-center">
                    <li v-for="color in colors" :key="color" class="mr-4 last:mr-0">
                      <span
                          :class="(selectedColor === color) ? 'border-gray-500' : '' "
                          @click="selectedColor = color"
                          class="block p-1 border-2 rounded-full transition ease-in duration-300 focus:outline-none  ">
                        <button
                            :class="color"
                            @click="selectedColor = color"
                            class="block w-4 h-4 rounded-full focus:outline-none"
                        />
                      </span>
                    </li>
                  </ul>
                  <div>
                    <label for="name" class="block text-sm mx-2 font-medium text-gray-700">Name</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LightBulbIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input type="text"
                             name="name"
                             id="name"
                             v-model="name"
                             class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                             placeholder="Leet server" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-6">
              <button
                  type="button"
                  @click="saveTag"
                  class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
// import { ref } from 'vue'
import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {LightBulbIcon} from "@heroicons/vue/solid"

export default {
  name: "TagModal",
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    LightBulbIcon
  },
  data: () => {return {
    colors: [
      'bg-red-200',
      'bg-yellow-200',
      'bg-green-200',
      'bg-cyan-200',
      'bg-teal-200',
      'bg-indigo-200',
      'bg-pink-200',
      'bg-purple-200',
      'bg-blue-200',
      'bg-gra-200y'
    ],
    selectedColor: '',
    name: '',
    id: ''
  }},
  props: [
      'open',
      'tag'
  ],
  computed: {
    tagObject() {
      if (this.tag) {
        return {
          id: this.tag.id,
          name: this.name,
          color: this.selectedColor
        }
      } else {
        return {
          name: this.name,
          color: this.selectedColor
        }
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    saveTag() {
      this.$store.dispatch('save_tag', this.tagObject)
      this.closeModal()
    }
  },
  emits: ['close'],
  unmounted() {
  },
  updated() {
    this.$nextTick(() => {
      if (this.$props.tag) {
        this.name = this.$props.tag.name
        this.selectedColor = this.tag.color
      }
    })
  }
}
</script>
