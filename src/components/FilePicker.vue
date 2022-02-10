<template>
  <div
      class="border rounded-md px-3 py-2 shadow-sm focus-within:ring-1 m-2
            focus-within:ring-indigo-600 focus-within:border-indigo-600 border-gray-300
            dark:border-slate-500 dark:focus-within:ring-slate-400 dark:focus-within:border-slate-400 ">
    <label :for="id" class="block text-xs font-medium text-gray-900 dark:text-gray-300 ">
      {{ labelText }}
    </label>
    <div class="flex">
      <input type="text" :name="labelText" :id="id"
             :placeholder="placeholder"
             :value="modelValue"
             @change="$emit('update:modelValue', $event.target.value)"
             class="inline-block w-full border-0 p-0
                  text-gray-900 placeholder-gray-500
                  dark:bg-slate-800 dark:text-gray-300 dark:placeholder-gray-400
                  focus:ring-0 sm:text-sm focus:outline-none"
      />
      <button
          v-if="props.button === 'file'"
          @click="handleFile"
          class="inline-block -ml-px relative inline-flex items-center space-x-2  p-1 border text-sm font-medium rounded-md focus:outline-none focus:ring-1
     border-gray-300  text-gray-700 bg-gray-50 hover:bg-gray-100 focus:ring-indigo-500 focus:border-indigo-500
     dark:border-slate-500 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
        <FolderOpenIcon class="h-4 w-4"/>
      </button>
    </div>
  </div>
</template>


<script setup>
import {FolderOpenIcon} from "@heroicons/vue/outline"
import {open} from "@tauri-apps/api/dialog"

const props = defineProps({
  id: String,
  labelText: String,
  placeholder: String,
  modelValue: String,
  directory: Boolean,
  button: String
})

const emit = defineEmits(['update:modelValue'])

const handleFile = () => {
  open({directory: (props.directory === "true")}).then(file => {
    emit('update:modelValue', file)
  })
}
</script>
