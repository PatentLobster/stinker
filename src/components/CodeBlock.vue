<template>
<div
    ref="codeBlock"
    class="p-2 my-3 min-w-1/2 shadow bg-white rounded-2xl mx-auto whitespace-pre justify-self-center"
>
  <pre class="language-php rounded">
    <code class="language-php whitespace-pre">
      <slot/>
    </code>
  </pre>
</div>
</template>

<script>
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'
import 'prism-es6/components/prism-markup-templating';
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace'
import 'prism-es6/components/prism-php';

export default {
  name: "CodeBlock",
  mounted() {
    Prism.plugins.NormalizeWhitespace.setDefaults({
      'remove-trailing': true,
      'remove-indent': true,
      'left-trim': true,
      'right-trim': true,
      /*'break-lines': 80,
      'indent': 2,
      'remove-initial-line-feed': false,
      'tabs-to-spaces': 4,
      'spaces-to-tabs': 4*/
    });
    Prism.highlightAllUnder(this.$refs.codeBlock);
  },


}
</script>

<style scoped>

</style>