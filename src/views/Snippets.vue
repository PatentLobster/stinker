<template>
  <div> Snippets </div>
  {{snip}}
</template>


<script setup>
import {useStore} from "../store/snippets";
const snip = useStore()
</script>

<script>
export default {
  name: "Snippets"
}
</script>