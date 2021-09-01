<template>
 <span
     :class="[
              tag.color,
                        `inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium text-gray-800`
                    ]"
     @mouseover="hover = true"
     @click="(!editable) ? cb(tag) : ''"
     @mouseleave="hover = false"
 >
  {{ tag.name }}
      <span
          v-if="(hover && editable)"
          @click="cb(tag)"
          class="mx-1"
      >
     <SearchIcon class="w-4 h-4  hover:text-gray-500" />
   </span>
   <span
       v-if="(hover && editable)"
       @click="edit(tag)"
       class="mx-1"
   >
     <PencilIcon class="w-4 h-4  hover:text-gray-500" />
   </span>
   <span
          v-if="(hover && editable)"
          @click="deleteTag(tag)"
          class="mx-1 "
      >
     <TrashIcon class="w-4 h-4 hover:text-gray-500" />
   </span>
  </span>
</template>

<script>

import {PencilIcon, TrashIcon, SearchIcon} from "@heroicons/vue/solid"
export default {
  name: "ATag",
  components: {
    PencilIcon,
    TrashIcon,
    SearchIcon
  },
  props: ['tag', 'cb' , 'edit', 'editable'],
  data: () => {
    return {
      hover: false
    }
  },
  methods: {
    deleteTag(tag) {
      this.$store.dispatch('delete_tag', tag)
    }
  }
}
</script>