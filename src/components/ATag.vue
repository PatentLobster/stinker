<template>
 <span
     :class="[
              tag.color,
                        `inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium text-gray-800`
                    ]"
     @click="cb(tag)"
     @mouseover="hover = true"
     @mouseleave="hover = false"
 >
  {{ tag.name }}
   <span
       v-if="(hover && editable)"
       @click="edit(tag)"
   >
     <PencilIcon class="w-4 h-4" />
   </span>
   <span
          v-if="(hover && editable)"
          @click="deleteTag(tag)"
      >
     <TrashIcon class="w-4 h-4" />
   </span>
  </span>
</template>

<script>

import {PencilIcon, TrashIcon} from "@heroicons/vue/solid"
export default {
  name: "ATag",
  components: {
    PencilIcon,
    TrashIcon
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