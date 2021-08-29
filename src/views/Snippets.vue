<template>
  <div>
    <TagModal :open="editingTag" @close="closeTagModal" :tag="tag"/>
    <SnippetModal :open="editingSnippet" @close="editingSnippet = false" :snippet="selectedSnippet" />
    <div class="min-h-screen overflow-auto divide-y" v-if="snippets_count > 0">
      <div class="sr-only">
        You got: {{snippets_count}} snippets.
      </div>
      <div class="flex p-2 my-auto">
        <span class="text-lg font-bold pr-2">Tags: </span>
        <ul class="flex my-auto flex-row justify-center py-0.5 items-center">
          <li v-for="tag in tags" :key="tag.name" class="mr-4 my-auto last:mr-0">
            <ATag :tag="tag" :edit="edit_tag"  :cb="filter_tag" :editable="true"/>
          </li>
        </ul>
        <div class="mr-2 ml-auto">
          <button
              type="button"
              @click="editingTag = true"
              class="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
          class=" grid grid-cols-1 gap-6"
          v-for="(snippet, i)  in snippets"
          :key="i"
      >
        <div
            class="grid-cols-2"
        >
          <div class="flex mx-auto justify-center">
            <h3
                v-html="snippet.name"
            />
          </div>
<!--          <div v-for="tag in snippet.tags" :key="tag">-->
<!--          {{tag}}-->
<!--        </div>-->
          <div class="flex justify-self-center">
            <CodeBlock class="relative ml-2 mr-auto">
              {{snippet.code}}
            </CodeBlock>
            <div class="relative mr-2 mt-3">
              <button
                  @click="delete_snippet(snippet)"
                  type="button"
                  class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon
                    class="mr-2 -ml-0.5 h-4 w-4"
                    aria-hidden="true" /> Delete
              </button>

              <button
                  @click="edit_snippet(snippet)"
                  type="button"
                  class="inline-flex items-center m-1 px-4 py-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <PencilAltIcon
                    class="mr-2 -ml-0.5 h-4 w-4"
                    aria-hidden="true" /> Edit.
              </button>
              <span class="relative flex py-2 shadow-sm rounded-md overflow-visible">
                <button
                    type="button"
                    @click="execute_snippet(snippet.code)"
                    class="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <LightningBoltIcon
                      class="mr-2 -ml-0.5 h-4 w-4"
                      aria-hidden="true" /> Tinker
                </button>
                <Menu as="span" class="-ml-px relative block overflow-visible">
                  <MenuButton class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                    <span class="sr-only">Open options</span>
                    <ChevronDownIcon class="h-5 w-5" aria-hidden="true" />
                  </MenuButton>
                  <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <MenuItems class="origin-top-right absolute right-0 z-10  mt-2 mr-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div class="py-1">
                        <MenuItem v-for="server in servers" :key="server.name">
                          <div
                              @click="execute_server(snippet.code, server)"
                              class="text-center flex active text-gray-700 block px-4 py-2 text-sm"
                              :class="[`hover:bg-${server.color}-50`]"
                          >
                            <ServerIcon
                                :class="`text-${server.color}-500`"
                                class="w-4 h-4 ml-0 my-auto"/>
                            <span class="mx-auto my-auto" v-text="server.name" />
                          </div>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
                </Menu>
              </span>
            </div>
          </div>

        </div>
      </div>
      </div>
    <div
        v-else
        class="flex justify-center w-full justify-self-center my-3"
    >
      <div
          class="grid text-center justify-center w-3/4 bg-white shadow drop-shadow-md rounded-2xl border border-blue"
      >
        <h1
            class="align-middle block my-2 text-lg font-bold"
        >
          Wow, such empty.
        </h1>
        <img src="@/assets/doge.png"
             alt="Doge"
             class="block h-32 w-32 my-2 justify-self-center"
        >
        <p class="leading-1 mb-3">
          Stinks, no snippets found.
        </p>
      </div>
    </div>

  </div>

  <Modal :is-open="isOpen"
         :is-error="isError"
         :content="output"
         :close-modal="closeModal"
  />

</template>

<script>

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon, ServerIcon, PlusIcon, PencilAltIcon } from '@heroicons/vue/solid'
import {TrashIcon, LightningBoltIcon}  from '@heroicons/vue/outline'
import { mapState } from "vuex";
import Modal from "../components/Modal";
import TagModal from "../components/TagModal";
import SnippetModal from "../components/SnippetModal";
import CodeBlock from "../components/CodeBlock";
import ATag from "../components/ATag";

export default {
  name: "Snippets",
  components: {
    ATag,
    TrashIcon,
    LightningBoltIcon,
    CodeBlock,
    Modal,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    ChevronDownIcon,
    ServerIcon,
    PlusIcon,
    PencilAltIcon,
    TagModal,
    SnippetModal
  },
  data: () => {
    return {
      isOpen: false,
      tag: {},
      editingTag: false,
      editingSnippet: false,
      selectedSnippet: {},
    }
  },
  computed: {
    ...mapState([`snippets`, `snippets_count`,`servers`, `code_path`, `code`, `output`, `isError`, `tags`]),

  },
  methods: {
    edit_tag(tag) {
      this.tag = tag;
      this.editingTag = true;
    },
    filter_tag(tag) {
      console.log(tag)
    },
    edit_snippet(snippet) {
      this.selectedSnippet = snippet;
      this.editingSnippet = true;
    },
    delete_snippet(item) {
      this.$store.dispatch('delete_snippet', item)
    },
    execute_snippet(code) {
      this.$store.dispatch('update_code', code)
      this.$router.push('/tinker')
    },
    closeTagModal() {
      this.tag = {}
      this.editingTag = false;
    },
    closeModal() {
      this.snippet = null
      this.isOpen = false;
    },
    execute_server(code, server) {
      this.$store.dispatch('update_code', code)
      this.$store.commit('clear_output')
      this.isOpen = true;
      this.$store.dispatch('executeServer', server)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$store.commit('refresh_servers')
    })
  },
  watch: {
    snippets: function(newVal) {
      if (this.selectedSnippet.id) {
        const snippet = newVal.find(snippet => snippet.id === this.selectedSnippet.id)
        this.selectedSnippet.tags = snippet.tags;
      }
    }
  }
}
</script>