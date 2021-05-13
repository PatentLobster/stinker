<template>
  <div class="home">
    <Tinker />
    <div class="flex flex-col flex-1">
      <Editor class="flex-1" language="php-x" theme="one-light" v-model="code"></Editor>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import Tinker from "../components/Tinker";
import Editor from "../components/Editor";
import "@/lib/tinker";
export default {
  name: 'Home',
  components: {
    Tinker,
    Editor
  },
  computed: {
    code: ''
  }
}
</script>
