<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="fixed z-10 inset-0 overflow-y-auto" @close="closeModal">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                         leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
        </TransitionChild>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <TransitionChild as="template" enter="ease-out duration-300"
                         enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                         enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                         leave-from="opacity-100 translate-y-0 sm:scale-100"
                         leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
          <div
              class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-visible shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div>
              <div class="mt-3 text-center sm:mt-5">
                <DialogTitle as="h3" class="text-lg leading-6 font-medium text-gray-900">
                  Edit Snippet
                </DialogTitle>
                <div class="mt-2">
                  <div>
                    <label for="name" class="block text-sm mx-2 font-medium text-gray-700">Name</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LightBulbIcon class="h-5 w-5 text-gray-400" aria-hidden="true"/>
                      </div>
                      <input type="text"
                             name="name"
                             id="name"
                             v-model="name"
                             class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                             placeholder="Stinky snippet"/>
                    </div>
                  </div>

                  <div class="mt-2">
                    <label for="Tags" class="block text-sm mx-2 font-medium text-gray-700 my-auto">Tags:</label>
                  </div>
                  <div class="w-72 relative inline mx-auto">
                    <Listbox>
                      <div class="relative mt-1">
                        <ListboxButton
                            class="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md border cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm"
                        >
                          <span
                              v-for="tag in snippet.tags"
                              v-html="tag"
                              :key="tag"
                              :class="[
                                   tagColor(tag),
                                                `inline-flex items-center px-3 mx-1 py-0.5 rounded-full text-sm font-medium text-gray-800`
                                                ]"
                          />
                          <span
                              class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
                          >
            <SelectorIcon class="w-5 h-5 text-gray-400" aria-hidden="true"/>
          </span>
                        </ListboxButton>

                        <transition
                            leave-active-class="transition duration-100 ease-in"
                            leave-from-class="opacity-100"
                            leave-to-class="opacity-0"
                        >
                          <ListboxOptions
                              class="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-30"
                          >
                            <ListboxOption
                                v-slot="{ active }"
                                v-for="tag in tags"
                                :key="tag.id"
                                :value="tag.name"
                                as="template"
                            >
                              <li
                                  :class="[
                                    active ? ' bg-gray-100' : '',
                                    'cursor-default select-none relative py-2 pl-10 pr-4 flex',
                                  ]"
                                  @click="tag_snippet(tag)"
                              >
                                <span
                                    class="relative inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                                >
                                <CheckIcon
                                    class="w-5 h-5"
                                    v-if="snippet.tags.includes(tag.name)"/>
                                </span>
                                <ATag
                                    :tag="tag"
                                    :key="tag.id"
                                    callback="tag_snippet(tag)"
                                />

                              </li>
                            </ListboxOption>
                          </ListboxOptions>
                        </transition>
                      </div>
                    </Listbox>
                  </div>

                  <div class="min-h-full mt-2">
                    <label for="code" class="block text-sm mx-2 font-medium text-gray-700 my-2">Code:</label>
                    <Editor class="h-64 text-left"
                            value=""
                            language="php-x"
                            ref="ide"
                            @change="setCode"

                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-6">
              <button
                  type="button"
                  @click="saveSnippet"
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


import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue'
import {LightBulbIcon, CheckIcon, SelectorIcon} from "@heroicons/vue/solid"

import ATag from "./ATag";
import Editor from "./Editor";
import {mapState} from "vuex";

export default {
  name: "TagModal",
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    SelectorIcon,
    CheckIcon,
    LightBulbIcon,
    Editor,
    ATag
  },
  data: () => {
    return {
      id: '',
      name: '',
      preload: '',
      createdAt: '',
    }
  },
  props: [
    'open',
    'snippet'
  ],
  computed: {
    ...mapState(['code', 'tags']),

  },
  methods: {
    tagColor(name) {
      return this.tags.find(tag => tag.name === name).color
    },
    tag_snippet(tag) {
      const payload = {
        tag,
        snippet: this.snippet
      }
      this.$store.dispatch('tag_snippet', payload)
    },
    closeModal() {
      this.$emit('close')
    },
    setCode() {
      this.$store.dispatch('update_code', this.$refs.ide.editor.getModel().getValue())
    },
    saveSnippet() {
      this.$store.dispatch('update_snippet', {
        id: this.id,
        name: this.name,
        code: this.code
      })
      this.closeModal()
    }
  },
  emits: ['close'],
  unmounted() {
  },
  updated() {
    this.$nextTick(() => {
      // if (this.$props.tag) {
      //   this.name = this.$props.tag.name
      //   this.selectedColor = this.tagObject.color
      // }
      this.$refs.ide.editor.getModel().setValue(this.code)
    })
  },
  watch: {
    snippet: function (val) {
      this.$nextTick(async () => {
        this.id = val.id
        this.name = val.name
        this.$store.dispatch('update_code', val.code)
        this.preload = val.preload
      })
    }
  }
}
</script>
