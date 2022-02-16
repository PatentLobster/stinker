<template>
  <pre class="language-php rounded" ref="codeBlock">
    <code class="language-php whitespace-pre" v-text="code" />
  </pre>
</template>

<script>
import Prism from 'prismjs';

import 'prism-es6/components/prism-markup-templating';
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace'
import 'prism-es6/components/prism-php';
export default {
  name: "CodeBlock",
  props: [
      "code"
  ],
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


}
</script>
