<template>
<div
    ref="codeBlock"
    class="p-2 my-3 min-w-1/2 shadow bg-white dark:bg-slate-700 dark:text-slate-100 rounded-2xl mx-auto whitespace-pre justify-self-center"
>
  <div class="flex">
    {{snippet.title}}
    <ConnDropdown  class="w-64 mr-16 ml-auto" @execute="executeSnippet"/>
    <TrashIcon class="w-6 h-6 mr-3 hover:text-red-500" @click="$emit('delete')" />
  </div>
  <pre class="language-php rounded">
    <code class="language-php whitespace-pre" v-text="snippet.code" />


  </pre>
</div>
</template>

<script>
import Prism from 'prismjs';
import ConnDropdown from './ConnDropdown.vue'

import 'prism-es6/components/prism-markup-templating';
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace'
import 'prism-es6/components/prism-php';
import {TrashIcon} from "@heroicons/vue/solid"

export default {
  name: "CodeBlock",
  props: [
    'snippetTitle',
      "snippet"
  ],
  emits: ['execute'],
  methods: {
    executeSnippet(e) {
      this.$emit('execute', {conn: e, snippet: this.$props.snippet})
    }
  },
  mounted() {
    Prism.plugins.NormalizeWhitespace.setDefaults({
      'remove-trailing': true,
      'remove-indent': true,
      'left-trim': true,
      'right-trim': true,
    });
    Prism.highlightAllUnder(this.$refs.codeBlock);
  },
  beforeMount() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      import('prism-themes/themes/prism-gruvbox-dark.css');
    } else {
      import('prismjs/themes/prism.min.css');
    }
  },
  components: {ConnDropdown, TrashIcon}


}
</script>
